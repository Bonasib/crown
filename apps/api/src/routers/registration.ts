import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '@ronda/db';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import type { UserRole } from '@ronda/types';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev_secret_change_in_production';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_DAYS = 30;
const OTP_EXPIRES_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;

function hashPassword(password: string): string {
  return createHash('sha256').update(password + 'salt_ronda_2024').digest('hex');
}

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateTokens(user: { id: string; email: string; roles: UserRole[]; orgId: string | null }) {
  const payload = { sub: user.id, email: user.email, orgId: user.orgId, roles: user.roles };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = createHash('sha256')
    .update(`${user.id}${Date.now()}${Math.random()}`)
    .digest('hex');
  return { accessToken, refreshToken, expiresIn: 900 };
}

export const registrationRouter = router({
  register: publicProcedure
    .input(
      z.object({
        accountType: z.enum(['IMPORTER', 'WAREHOUSE_OPERATOR']),
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phone: z.string().min(7),
        businessName: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
      });
      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email already registered' });
      }

      const role: UserRole = input.accountType === 'IMPORTER' ? 'IMPORTER' : 'WAREHOUSE_OPERATOR';

      // Create user in a platform-level org (no slug org for importers/warehouse)
      const user = await prisma.user.create({
        data: {
          email: input.email.toLowerCase(),
          passwordHash: hashPassword(input.password),
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          accountType: input.accountType,
          businessName: input.businessName,
          isActive: false, // activated after OTP verification
        },
      });

      // Queue OTP via outbox
      const code = generateOtpCode();
      const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);
      await prisma.otpVerification.create({
        data: {
          userId: user.id,
          code,
          channel: 'WHATSAPP',
          destination: input.phone,
          expiresAt,
        },
      });

      await prisma.outboxEvent.create({
        data: {
          topic: 'notification.otp',
          payload: {
            userId: user.id,
            phone: input.phone,
            code,
            channel: 'WHATSAPP',
            expiresMinutes: OTP_EXPIRES_MINUTES,
          },
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'USER_REGISTERED',
          resource: 'user',
          resourceId: user.id,
          after: { email: user.email, accountType: input.accountType },
        },
      });

      return { userId: user.id, channel: 'WHATSAPP', destination: input.phone };
    }),

  sendOtp: publicProcedure
    .input(z.object({ userId: z.string(), channel: z.enum(['WHATSAPP', 'SMS']).default('WHATSAPP') }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { id: input.userId } });
      if (!user?.phone) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found or no phone number' });
      }

      const code = generateOtpCode();
      const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);
      await prisma.otpVerification.create({
        data: {
          userId: user.id,
          code,
          channel: input.channel,
          destination: user.phone,
          expiresAt,
        },
      });

      await prisma.outboxEvent.create({
        data: {
          topic: 'notification.otp',
          payload: { userId: user.id, phone: user.phone, code, channel: input.channel, expiresMinutes: OTP_EXPIRES_MINUTES },
        },
      });

      return { sent: true, channel: input.channel };
    }),

  verifyOtp: publicProcedure
    .input(z.object({ userId: z.string(), code: z.string().length(6) }))
    .mutation(async ({ input }) => {
      const otp = await prisma.otpVerification.findFirst({
        where: {
          userId: input.userId,
          verifiedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!otp) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No active OTP found' });
      }

      if (otp.attempts >= OTP_MAX_ATTEMPTS) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many attempts. Request a new code.' });
      }

      if (otp.code !== input.code) {
        await prisma.otpVerification.update({
          where: { id: otp.id },
          data: { attempts: { increment: 1 } },
        });
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid code' });
      }

      // Mark verified, activate user
      await prisma.$transaction([
        prisma.otpVerification.update({
          where: { id: otp.id },
          data: { verifiedAt: new Date() },
        }),
        prisma.user.update({
          where: { id: input.userId },
          data: { isActive: true, phoneVerified: true },
        }),
      ]);

      // Issue tokens so user lands directly on onboarding
      const user = await prisma.user.findUniqueOrThrow({ where: { id: input.userId } });
      const role: UserRole = (user.accountType === 'IMPORTER' ? 'IMPORTER' : 'WAREHOUSE_OPERATOR') as UserRole;
      const tokens = generateTokens({ id: user.id, email: user.email, roles: [role], orgId: null });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_DAYS);
      await prisma.refreshToken.create({
        data: { userId: user.id, token: tokens.refreshToken, expiresAt },
      });

      return {
        ...tokens,
        user: { id: user.id, email: user.email, firstName: user.firstName, accountType: user.accountType },
      };
    }),

  completeOnboarding: protectedProcedure
    .input(
      z.object({
        businessName: z.string().min(1),
        businessAddress: z.string().optional(),
        preferredLang: z.enum(['en', 'ar']).default('en'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.sub;
      await prisma.user.update({
        where: { id: userId },
        data: {
          businessName: input.businessName,
          businessAddress: input.businessAddress,
          preferredLang: input.preferredLang,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: userId,
          action: 'ONBOARDING_COMPLETED',
          resource: 'user',
          resourceId: userId,
        },
      });

      return { success: true };
    }),
});
