import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { randomBytes } from 'crypto';
import { prisma } from '@ronda/db';
import { router, orgProcedure } from '../trpc';

function generateBarcodeCode(prefix: 'PRD' | 'CTN'): string {
  const random = randomBytes(6).toString('hex').toUpperCase();
  return `${prefix}-${random}`;
}

export const productsRouter = router({
  list: orgProcedure
    .input(z.object({ page: z.number().min(1).default(1), pageSize: z.number().min(1).max(100).default(20) }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const skip = (page - 1) * pageSize;
      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where: { organizationId: ctx.organizationId },
          include: { barcodes: { orderBy: { createdAt: 'desc' }, take: 1 } },
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
        prisma.product.count({ where: { organizationId: ctx.organizationId } }),
      ]);
      return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    }),

  get: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await prisma.product.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
        include: { barcodes: { include: { scanEvents: { orderBy: { createdAt: 'desc' }, take: 5 } }, orderBy: { createdAt: 'desc' } } },
      });
      if (!product) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
      return product;
    }),

  create: orgProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        hsCode: z.string().optional(),
        weightKg: z.number().positive().optional(),
        lengthCm: z.number().positive().optional(),
        widthCm: z.number().positive().optional(),
        heightCm: z.number().positive().optional(),
        imageKey: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await prisma.product.create({
        data: {
          organizationId: ctx.organizationId,
          name: input.name,
          description: input.description,
          hsCode: input.hsCode,
          weightKg: input.weightKg,
          lengthCm: input.lengthCm,
          widthCm: input.widthCm,
          heightCm: input.heightCm,
          imageKey: input.imageKey,
        },
      });

      // Auto-generate a PRODUCT barcode
      const code = generateBarcodeCode('PRD');
      const qrDeepLink = `${process.env['APP_URL'] ?? 'https://app.smartimport.io'}/scan/${code}`;
      const barcode = await prisma.barcode.create({
        data: { productId: product.id, type: 'PRODUCT', code, qrDeepLink },
      });

      // Queue AI description fill if no description provided
      if (!input.description) {
        await prisma.outboxEvent.create({
          data: {
            topic: 'ai.product_description',
            payload: { productId: product.id, productName: input.name, imageKey: input.imageKey ?? null },
          },
        });
      }

      // Queue AI HS Code suggestion if not provided
      if (!input.hsCode) {
        await prisma.outboxEvent.create({
          data: {
            topic: 'ai.hs_code_suggestion',
            payload: { productId: product.id, productName: input.name, description: input.description ?? null },
          },
        });
      }

      await prisma.auditLog.create({
        data: {
          actorId: ctx.user.sub,
          organizationId: ctx.organizationId,
          action: 'PRODUCT_CREATED',
          resource: 'product',
          resourceId: product.id,
          after: { name: product.name },
        },
      });

      return { product, barcode };
    }),

  update: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        hsCode: z.string().optional(),
        weightKg: z.number().positive().optional(),
        lengthCm: z.number().positive().optional(),
        widthCm: z.number().positive().optional(),
        heightCm: z.number().positive().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const existing = await prisma.product.findFirst({
        where: { id, organizationId: ctx.organizationId },
      });
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });

      const product = await prisma.product.update({ where: { id }, data });

      await prisma.auditLog.create({
        data: {
          actorId: ctx.user.sub,
          organizationId: ctx.organizationId,
          action: 'PRODUCT_UPDATED',
          resource: 'product',
          resourceId: id,
          before: existing,
          after: product,
        },
      });

      return product;
    }),

  generateCartonBarcode: orgProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const product = await prisma.product.findFirst({
        where: { id: input.productId, organizationId: ctx.organizationId },
      });
      if (!product) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });

      const code = generateBarcodeCode('CTN');
      const qrDeepLink = `${process.env['APP_URL'] ?? 'https://app.smartimport.io'}/scan/${code}`;
      const barcode = await prisma.barcode.create({
        data: { productId: input.productId, type: 'CARTON', code, qrDeepLink },
      });

      return barcode;
    }),

  sendBarcodeWhatsApp: orgProcedure
    .input(z.object({ barcodeId: z.string(), recipientPhone: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const barcode = await prisma.barcode.findFirst({
        where: { id: input.barcodeId, product: { organizationId: ctx.organizationId } },
        include: { product: true },
      });
      if (!barcode) throw new TRPCError({ code: 'NOT_FOUND', message: 'Barcode not found' });

      await prisma.outboxEvent.create({
        data: {
          topic: 'notification.whatsapp',
          payload: {
            template: 'barcode_share',
            recipientPhone: input.recipientPhone,
            variables: {
              productName: barcode.product.name,
              barcodeCode: barcode.code,
              qrLink: barcode.qrDeepLink,
            },
          },
        },
      });

      await prisma.barcode.update({
        where: { id: input.barcodeId },
        data: { whatsappSentAt: new Date() },
      });

      return { queued: true };
    }),
});
