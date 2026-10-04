import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@ronda/db';
import { router, publicProcedure } from '../trpc';
import type { JwtPayload, AuthTokens, UserRole } from '@ronda/types';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev_secret_change_in_production';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_DAYS = 30;

const BCRYPT_ROUNDS = 12;
// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('dummy-password', BCRYPT_ROUNDS);

function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

// Unsalted-per-user SHA-256 used before bcrypt (still written by prisma/seed.ts).
function legacyHash(password: string): string {
  return createHash('sha256').update(password + 'salt_ronda_2024').digest('hex');
}

function isBcryptHash(hash: string): boolean {
  return hash.startsWith('$2');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (isBcryptHash(hash)) return bcrypt.compare(password, hash);
  const a = Buffer.from(legacyHash(password));
  const b = Buffer.from(hash);
  return a.length === b.length && timingSafeEqual(a, b);
}

function generateTokens(user: { id: string; email: string; roles: UserRole[]; orgId: string | null }): AuthTokens {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    orgId: user.orgId,
    roles: user.roles,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = randomBytes(32).toString('hex');

  return { accessToken, refreshToken, expiresIn: 900 };
}

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        organizationSlug: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
        include: {
          memberships: {
            include: { organization: true },
          },
        },
      });

      const passwordOk = await verifyPassword(input.password, user?.passwordHash ?? DUMMY_HASH);
      if (!user || !user.isActive || !passwordOk) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
      }

      // Determine org context
      let orgId: string | null = null;
      let roles: UserRole[] = [];

      if (input.organizationSlug) {
        const membership = user.memberships.find(
          (m) => m.organization.slug === input.organizationSlug,
        );
        if (membership) {
          orgId = membership.organizationId;
          roles = membership.roles as UserRole[];
        }
      } else if (user.memberships.length === 1 && user.memberships[0]) {
        orgId = user.memberships[0].organizationId;
        roles = user.memberships[0].roles as UserRole[];
      }

      // Check for SUPER_ADMIN (no org membership needed)
      // In production, super admins would be flagged in DB
      if (user.email === 'admin@ronda.ship') {
        roles = ['SUPER_ADMIN'];
      }

      const tokens = generateTokens({ id: user.id, email: user.email, roles, orgId });

      // Store refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_DAYS);
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt,
        },
      });

      // Update last login, upgrading a legacy hash now that we know the password
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          ...(isBcryptHash(user.passwordHash)
            ? {}
            : { passwordHash: await hashPassword(input.password) }),
        },
      });

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles,
          orgId,
        },
      };
    }),

  refresh: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      const stored = await prisma.refreshToken.findUnique({
        where: { token: input.refreshToken },
        include: {
          user: {
            include: {
              memberships: true,
            },
          },
        },
      });

      if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired refresh token' });
      }

      const user = stored.user;
      if (!user.isActive) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User account disabled' });
      }

      // Rotate refresh token
      await prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
      });

      const firstMembership = user.memberships[0];
      const roles = (firstMembership?.roles as UserRole[]) ?? [];
      const orgId = firstMembership?.organizationId ?? null;

      const tokens = generateTokens({ id: user.id, email: user.email, roles, orgId });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_DAYS);
      await prisma.refreshToken.create({
        data: { userId: user.id, token: tokens.refreshToken, expiresAt },
      });

      return tokens;
    }),

  logout: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.refreshToken.updateMany({
        where: { token: input.refreshToken },
        data: { revokedAt: new Date() },
      });
      return { success: true };
    }),
});
