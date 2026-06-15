import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { prisma } from '@ronda/db';
import { router, protectedProcedure, orgProcedure } from '../trpc';

const importerProcedure = protectedProcedure;

export const importerRouter = router({
  dashboard: importerProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.sub;
    const orgId = ctx.user.orgId;

    const [activeShipments, pendingInvoices, recentProducts, recentShipments] = await Promise.all([
      orgId
        ? prisma.shipment.count({ where: { organizationId: orgId, status: { notIn: ['DELIVERED', 'CLOSED', 'CANCELLED'] } } })
        : 0,
      orgId
        ? prisma.invoice.count({ where: { organizationId: orgId, status: 'ISSUED' } })
        : 0,
      orgId
        ? prisma.product.findMany({
            where: { organizationId: orgId },
            include: { barcodes: { take: 1, orderBy: { createdAt: 'desc' } } },
            orderBy: { createdAt: 'desc' },
            take: 5,
          })
        : [],
      orgId
        ? prisma.shipment.findMany({
            where: { organizationId: orgId },
            include: { trackingEvents: { orderBy: { createdAt: 'desc' }, take: 1 } },
            orderBy: { updatedAt: 'desc' },
            take: 5,
          })
        : [],
    ]);

    return { activeShipments, pendingInvoices, recentProducts, recentShipments };
  }),

  invoices: router({
    list: orgProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(50).default(10),
          status: z.string().optional(),
        }),
      )
      .query(async ({ ctx, input }) => {
        const where = {
          organizationId: ctx.organizationId,
          ...(input.status ? { status: input.status as never } : {}),
        };
        const skip = (input.page - 1) * input.pageSize;
        const [items, total] = await Promise.all([
          prisma.invoice.findMany({
            where,
            include: { lineItems: true, revisions: { orderBy: { createdAt: 'desc' }, take: 1 } },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: input.pageSize,
          }),
          prisma.invoice.count({ where }),
        ]);
        return { items, total, page: input.page, pageSize: input.pageSize, totalPages: Math.ceil(total / input.pageSize) };
      }),

    respond: orgProcedure
      .input(
        z.object({
          id: z.string(),
          action: z.enum(['APPROVED', 'DECLINED', 'REVISION_REQUESTED']),
          reason: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const invoice = await prisma.invoice.findFirst({
          where: { id: input.id, organizationId: ctx.organizationId },
        });
        if (!invoice) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found' });
        if (invoice.status !== 'ISSUED') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invoice is not awaiting response' });
        }

        let newStatus: 'ISSUED' | 'VOID' = 'ISSUED';
        if (input.action === 'APPROVED') {
          // Payment happens via Stripe; status updated by webhook
          // Record approval intent
        } else if (input.action === 'DECLINED') {
          newStatus = 'VOID';
        }

        await prisma.invoiceRevision.create({
          data: {
            invoiceId: invoice.id,
            action: input.action,
            actorId: ctx.user.sub,
            reason: input.reason,
          },
        });

        if (input.action === 'DECLINED') {
          await prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'VOID' } });
        }

        // Notify admin
        await prisma.outboxEvent.create({
          data: {
            topic: 'notification.whatsapp',
            payload: {
              template: 'invoice_response',
              invoiceId: invoice.id,
              invoiceNumber: invoice.number,
              action: input.action,
              reason: input.reason,
            },
          },
        });

        return { success: true, action: input.action };
      }),
  }),

  shipments: router({
    list: orgProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(50).default(10),
        }),
      )
      .query(async ({ ctx, input }) => {
        const skip = (input.page - 1) * input.pageSize;
        const [items, total] = await Promise.all([
          prisma.shipment.findMany({
            where: { organizationId: ctx.organizationId },
            include: {
              trackingEvents: { orderBy: { timestamp: 'desc' }, take: 1 },
              milestones: { orderBy: { order: 'asc' } },
              documents: { select: { type: true, status: true } },
              invoices: { select: { status: true, totalMinor: true, currency: true, stripePaymentLink: true }, take: 1 },
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: input.pageSize,
          }),
          prisma.shipment.count({ where: { organizationId: ctx.organizationId } }),
        ]);
        return { items, total, page: input.page, pageSize: input.pageSize, totalPages: Math.ceil(total / input.pageSize) };
      }),

    get: orgProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const shipment = await prisma.shipment.findFirst({
          where: { id: input.id, organizationId: ctx.organizationId },
          include: {
            trackingEvents: { orderBy: { timestamp: 'desc' } },
            milestones: { orderBy: { order: 'asc' } },
            documents: true,
            invoices: {
              include: {
                lineItems: true,
                revisions: { orderBy: { createdAt: 'desc' } },
                payments: { orderBy: { createdAt: 'desc' } },
              },
            },
          },
        });
        if (!shipment) throw new TRPCError({ code: 'NOT_FOUND', message: 'Shipment not found' });
        return shipment;
      }),

    uploadDocument: orgProcedure
      .input(
        z.object({
          shipmentId: z.string(),
          type: z.enum([
            'COMMERCIAL_INVOICE', 'PACKING_LIST', 'BILL_OF_LADING', 'COO',
            'INSPECTION_REPORT', 'MSDS', 'DG_DECLARATION', 'PHYTOSANITARY',
          ]),
          fileKey: z.string(),
          fileName: z.string(),
          fileSizeBytes: z.number().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const shipment = await prisma.shipment.findFirst({
          where: { id: input.shipmentId, organizationId: ctx.organizationId },
        });
        if (!shipment) throw new TRPCError({ code: 'NOT_FOUND', message: 'Shipment not found' });

        const doc = await prisma.document.create({
          data: {
            organizationId: ctx.organizationId,
            shipmentId: input.shipmentId,
            type: input.type,
            status: 'UPLOADED',
            fileKey: input.fileKey,
            fileName: input.fileName,
            fileSizeBytes: input.fileSizeBytes,
            uploadedAt: new Date(),
          },
        });

        // Queue OCR + AI extraction
        await prisma.outboxEvent.create({
          data: {
            topic: 'ai.document_ocr',
            payload: {
              documentId: doc.id,
              fileKey: input.fileKey,
              documentType: input.type,
              shipmentId: input.shipmentId,
            },
          },
        });

        return doc;
      }),
  }),
});
