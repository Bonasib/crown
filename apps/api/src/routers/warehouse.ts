import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { randomBytes } from 'crypto';
import { prisma } from '@ronda/db';
import { router, orgProcedure, publicProcedure } from '../trpc';

const MAGIC_LINK_EXPIRES_HOURS = 72;

export const warehouseRouter = router({
  recordReceiving: orgProcedure
    .input(
      z.object({
        barcodeCode: z.string(),
        actualWeightKg: z.number().positive().optional(),
        actualLengthCm: z.number().positive().optional(),
        actualWidthCm: z.number().positive().optional(),
        actualHeightCm: z.number().positive().optional(),
        condition: z.enum(['GOOD', 'DAMAGED', 'PARTIAL']).optional(),
        photoKeys: z.array(z.string()).default([]),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const barcode = await prisma.barcode.findUnique({
        where: { code: input.barcodeCode },
        include: { product: true },
      });

      if (!barcode) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Barcode not found' });
      }

      // Record scan event
      await prisma.barcodeScan.create({
        data: { barcodeId: barcode.id, scannedById: ctx.user.sub },
      });

      const receiving = await prisma.warehouseReceiving.create({
        data: {
          organizationId: ctx.organizationId,
          barcodeId: barcode.id,
          productId: barcode.productId,
          receivedById: ctx.user.sub,
          actualWeightKg: input.actualWeightKg,
          actualLengthCm: input.actualLengthCm,
          actualWidthCm: input.actualWidthCm,
          actualHeightCm: input.actualHeightCm,
          condition: input.condition,
          photoKeys: input.photoKeys,
          notes: input.notes,
        },
        include: { product: true, barcode: true },
      });

      // Notify importer via outbox
      await prisma.outboxEvent.create({
        data: {
          topic: 'notification.whatsapp',
          payload: {
            template: 'goods_received',
            organizationId: ctx.organizationId,
            productId: barcode.productId,
            receivingId: receiving.id,
            productName: barcode.product.name,
            condition: input.condition ?? 'GOOD',
          },
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: ctx.user.sub,
          organizationId: ctx.organizationId,
          action: 'GOODS_RECEIVED',
          resource: 'warehouse_receiving',
          resourceId: receiving.id,
          after: { productId: barcode.productId, barcodeCode: input.barcodeCode },
        },
      });

      return receiving;
    }),

  list: orgProcedure
    .input(z.object({ page: z.number().min(1).default(1), pageSize: z.number().min(1).max(100).default(20) }))
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.pageSize;
      const [items, total] = await Promise.all([
        prisma.warehouseReceiving.findMany({
          where: { organizationId: ctx.organizationId },
          include: { product: true, barcode: true, receivedBy: { select: { firstName: true, lastName: true } }, magicLink: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: input.pageSize,
        }),
        prisma.warehouseReceiving.count({ where: { organizationId: ctx.organizationId } }),
      ]);
      return { items, total, page: input.page, pageSize: input.pageSize, totalPages: Math.ceil(total / input.pageSize) };
    }),

  get: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const receiving = await prisma.warehouseReceiving.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
        include: {
          product: true,
          barcode: { include: { scanEvents: { orderBy: { createdAt: 'desc' } } } },
          receivedBy: { select: { firstName: true, lastName: true, email: true } },
          magicLink: true,
        },
      });
      if (!receiving) throw new TRPCError({ code: 'NOT_FOUND', message: 'Receiving record not found' });
      return receiving;
    }),

  createMagicLink: orgProcedure
    .input(z.object({ receivingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const receiving = await prisma.warehouseReceiving.findFirst({
        where: { id: input.receivingId, organizationId: ctx.organizationId },
      });
      if (!receiving) throw new TRPCError({ code: 'NOT_FOUND', message: 'Receiving record not found' });

      // Revoke existing unused magic link by expiring it
      const existing = await prisma.supplierMagicLink.findUnique({ where: { receivingId: input.receivingId } });
      if (existing?.usedAt) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Supplier has already submitted details' });
      }

      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRES_HOURS * 60 * 60 * 1000);

      const link = existing
        ? await prisma.supplierMagicLink.update({ where: { receivingId: input.receivingId }, data: { token, expiresAt } })
        : await prisma.supplierMagicLink.create({ data: { receivingId: input.receivingId, token, expiresAt } });

      const magicUrl = `${process.env['APP_URL'] ?? 'https://app.smartimport.io'}/supplier/${token}`;

      return { token, magicUrl, expiresAt };
    }),

  // Public endpoint — supplier fills dispatch details via magic link (no auth)
  submitMagicLink: publicProcedure
    .input(
      z.object({
        token: z.string(),
        supplierName: z.string().min(1),
        dispatchDate: z.string().datetime(),
        trackingNumber: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const link = await prisma.supplierMagicLink.findUnique({
        where: { token: input.token },
        include: { receiving: { include: { product: true } } },
      });

      if (!link) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid or expired link' });
      if (link.usedAt) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Link already used' });
      if (link.expiresAt < new Date()) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Link has expired' });

      await prisma.supplierMagicLink.update({
        where: { token: input.token },
        data: {
          usedAt: new Date(),
          supplierName: input.supplierName,
          dispatchDate: new Date(input.dispatchDate),
          trackingNumber: input.trackingNumber,
          notes: input.notes,
        },
      });

      // Notify warehouse via outbox
      await prisma.outboxEvent.create({
        data: {
          topic: 'notification.whatsapp',
          payload: {
            template: 'supplier_dispatch_submitted',
            receivingId: link.receivingId,
            productName: link.receiving.product.name,
            supplierName: input.supplierName,
            dispatchDate: input.dispatchDate,
          },
        },
      });

      return { success: true };
    }),

  getMagicLinkDetails: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const link = await prisma.supplierMagicLink.findUnique({
        where: { token: input.token },
        include: { receiving: { include: { product: { select: { name: true, imageKey: true } } } } },
      });

      if (!link) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid link' });
      if (link.expiresAt < new Date()) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Link has expired' });

      return {
        productName: link.receiving.product.name,
        imageKey: link.receiving.product.imageKey,
        alreadySubmitted: !!link.usedAt,
        expiresAt: link.expiresAt,
      };
    }),
});
