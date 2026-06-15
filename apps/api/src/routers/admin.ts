import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { prisma, Prisma } from '@ronda/db';
import { router, protectedProcedure, requireRoles } from '../trpc';

const adminProcedure = requireRoles('SUPER_ADMIN');

export const adminRouter = router({
  dashboard: adminProcedure.query(async () => {
    const [
      activeShipments,
      pendingInvoices,
      unpaidInvoicesTotal,
      pendingReceivings,
      hsCodeQueue,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.shipment.count({ where: { status: { notIn: ['DELIVERED', 'CLOSED', 'CANCELLED'] } } }),
      prisma.invoice.count({ where: { status: { in: ['ISSUED', 'OVERDUE'] } } }),
      prisma.invoice.aggregate({
        where: { status: { in: ['ISSUED', 'OVERDUE'] } },
        _sum: { totalMinor: true },
      }),
      prisma.warehouseReceiving.count({
        where: { magicLink: null },
      }),
      prisma.product.count({ where: { aiHsCode: { not: null }, hsCode: null } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { actor: { select: { email: true, firstName: true } } },
      }),
    ]);

    return {
      activeShipments,
      pendingInvoices,
      unpaidInvoicesTotalMinor: unpaidInvoicesTotal._sum.totalMinor ?? 0,
      pendingReceivings,
      hsCodeQueue,
      recentAuditLogs,
    };
  }),

  shipments: router({
    list: adminProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(100).default(20),
          status: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        const skip = (input.page - 1) * input.pageSize;
        const where = input.status ? { status: input.status as never } : {};
        const [items, total] = await Promise.all([
          prisma.shipment.findMany({
            where,
            include: {
              organization: { select: { name: true, slug: true } },
              trackingEvents: { orderBy: { createdAt: 'desc' }, take: 1 },
              invoices: { select: { status: true, totalMinor: true, currency: true }, take: 1 },
              documents: { select: { type: true, status: true } },
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: input.pageSize,
          }),
          prisma.shipment.count({ where }),
        ]);
        return { items, total, page: input.page, pageSize: input.pageSize, totalPages: Math.ceil(total / input.pageSize) };
      }),

    get: adminProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const shipment = await prisma.shipment.findUnique({
          where: { id: input.id },
          include: {
            organization: true,
            trackingEvents: { orderBy: { createdAt: 'desc' } },
            milestones: { orderBy: { order: 'asc' } },
            documents: true,
            invoices: { include: { lineItems: true, payments: true, revisions: true } },
          },
        });
        if (!shipment) throw new TRPCError({ code: 'NOT_FOUND', message: 'Shipment not found' });
        return shipment;
      }),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum([
            'BOOKED', 'CARGO_RECEIVED', 'INSPECTED', 'STUFFED',
            'CUSTOMS_EXPORT', 'IN_TRANSIT', 'TRANSHIPMENT',
            'CUSTOMS_IMPORT', 'ARRIVED', 'DELIVERED', 'CLOSED',
            'ON_HOLD', 'CANCELLED',
          ]),
          description: z.string().optional(),
          notifyImporter: z.boolean().default(true),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const shipment = await prisma.shipment.findUnique({ where: { id: input.id } });
        if (!shipment) throw new TRPCError({ code: 'NOT_FOUND', message: 'Shipment not found' });

        const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          const s = await tx.shipment.update({
            where: { id: input.id },
            data: { status: input.status as never },
          });
          await tx.trackingEvent.create({
            data: {
              shipmentId: input.id,
              status: input.status as never,
              timestamp: new Date(),
              description: input.description ?? `Status updated to ${input.status}`,
              source: 'MANUAL',
              addedById: ctx.user.sub,
            },
          });
          await tx.auditLog.create({
            data: {
              actorId: ctx.user.sub,
              organizationId: shipment.organizationId,
              action: 'SHIPMENT_STATUS_UPDATED',
              resource: 'shipment',
              resourceId: input.id,
              before: { status: shipment.status },
              after: { status: input.status },
            },
          });
          return s;
        });

        if (input.notifyImporter) {
          await prisma.outboxEvent.create({
            data: {
              topic: 'notification.whatsapp',
              payload: {
                template: 'shipment_status_update',
                organizationId: shipment.organizationId,
                shipmentId: input.id,
                newStatus: input.status,
                description: input.description,
              },
            },
          });
        }

        return updated;
      }),
  }),

  invoices: router({
    list: adminProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(100).default(20),
          status: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        const where = input.status ? { status: input.status as never } : {};
        const skip = (input.page - 1) * input.pageSize;
        const [items, total] = await Promise.all([
          prisma.invoice.findMany({
            where,
            include: {
              organization: { select: { name: true } },
              shipment: { select: { id: true, status: true } },
              lineItems: true,
              revisions: { orderBy: { createdAt: 'desc' }, take: 3 },
              payments: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: input.pageSize,
          }),
          prisma.invoice.count({ where }),
        ]);
        return { items, total, page: input.page, pageSize: input.pageSize, totalPages: Math.ceil(total / input.pageSize) };
      }),

    create: adminProcedure
      .input(
        z.object({
          organizationId: z.string(),
          shipmentId: z.string().optional(),
          currency: z.string().default('USD'),
          lineItems: z.array(
            z.object({
              description: z.string(),
              accountingCategory: z.enum(['COGS', 'OPEX', 'DUTY_VAT', 'MARGIN']),
              qty: z.number().min(1).default(1),
              unitPriceMinor: z.number().min(0),
            }),
          ),
          dueDate: z.string().datetime().optional(),
          notes: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const lineItemsWithTotals = input.lineItems.map((li) => ({
          ...li,
          totalMinor: li.qty * li.unitPriceMinor,
          currency: input.currency,
        }));

        const subtotalMinor = lineItemsWithTotals.reduce((s, li) => s + li.totalMinor, 0);
        const taxMinor = Math.round(subtotalMinor * 0.15); // 15% VAT
        const totalMinor = subtotalMinor + taxMinor;

        const count = await prisma.invoice.count();
        const number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        const invoice = await prisma.invoice.create({
          data: {
            organizationId: input.organizationId,
            shipmentId: input.shipmentId,
            number,
            currency: input.currency,
            subtotalMinor,
            taxMinor,
            totalMinor,
            dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
            notes: input.notes,
            lineItems: { create: lineItemsWithTotals },
          },
          include: { lineItems: true },
        });

        await prisma.auditLog.create({
          data: {
            actorId: ctx.user.sub,
            organizationId: input.organizationId,
            action: 'INVOICE_CREATED',
            resource: 'invoice',
            resourceId: invoice.id,
            after: { number, totalMinor },
          },
        });

        return invoice;
      }),

    issue: adminProcedure
      .input(
        z.object({
          id: z.string(),
          stripePaymentLink: z.string().url().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const invoice = await prisma.invoice.findUnique({ where: { id: input.id } });
        if (!invoice) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found' });
        if (invoice.status !== 'DRAFT') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Only DRAFT invoices can be issued' });
        }

        const updated = await prisma.invoice.update({
          where: { id: input.id },
          data: {
            status: 'ISSUED',
            issuedAt: new Date(),
            stripePaymentLink: input.stripePaymentLink,
          },
        });

        await prisma.outboxEvent.create({
          data: {
            topic: 'notification.whatsapp',
            payload: {
              template: 'invoice_issued',
              organizationId: invoice.organizationId,
              invoiceId: invoice.id,
              invoiceNumber: invoice.number,
              totalMinor: invoice.totalMinor,
              currency: invoice.currency,
              stripePaymentLink: input.stripePaymentLink,
            },
          },
        });

        await prisma.auditLog.create({
          data: {
            actorId: ctx.user.sub,
            organizationId: invoice.organizationId,
            action: 'INVOICE_ISSUED',
            resource: 'invoice',
            resourceId: invoice.id,
          },
        });

        return updated;
      }),

    revise: adminProcedure
      .input(
        z.object({
          id: z.string(),
          reason: z.string().min(1),
          lineItems: z.array(
            z.object({
              description: z.string(),
              accountingCategory: z.enum(['COGS', 'OPEX', 'DUTY_VAT', 'MARGIN']),
              qty: z.number().min(1).default(1),
              unitPriceMinor: z.number().min(0),
            }),
          ),
          newStripePaymentLink: z.string().url().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const invoice = await prisma.invoice.findUnique({
          where: { id: input.id },
          include: { lineItems: true },
        });
        if (!invoice) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found' });

        const lineItemsWithTotals = input.lineItems.map((li) => ({
          ...li,
          totalMinor: li.qty * li.unitPriceMinor,
          currency: invoice.currency,
        }));

        const subtotalMinor = lineItemsWithTotals.reduce((s, li) => s + li.totalMinor, 0);
        const taxMinor = Math.round(subtotalMinor * 0.15);
        const totalMinor = subtotalMinor + taxMinor;

        const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          // Archive old line items by deleting and recreating
          await tx.invoiceLineItem.deleteMany({ where: { invoiceId: invoice.id } });
          const inv = await tx.invoice.update({
            where: { id: invoice.id },
            data: {
              subtotalMinor,
              taxMinor,
              totalMinor,
              status: 'ISSUED',
              issuedAt: new Date(),
              stripePaymentLink: input.newStripePaymentLink ?? invoice.stripePaymentLink,
              lineItems: { create: lineItemsWithTotals },
            },
            include: { lineItems: true },
          });
          await tx.invoiceRevision.create({
            data: {
              invoiceId: invoice.id,
              action: 'REVISION_REQUESTED',
              actorId: ctx.user.sub,
              reason: input.reason,
            },
          });
          return inv;
        });

        await prisma.outboxEvent.create({
          data: {
            topic: 'notification.whatsapp',
            payload: {
              template: 'invoice_revised',
              organizationId: invoice.organizationId,
              invoiceId: invoice.id,
              invoiceNumber: invoice.number,
              newTotalMinor: totalMinor,
              currency: invoice.currency,
              stripePaymentLink: input.newStripePaymentLink ?? invoice.stripePaymentLink,
            },
          },
        });

        return updated;
      }),
  }),

  documents: router({
    pendingReview: adminProcedure
      .input(z.object({ page: z.number().min(1).default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const skip = (input.page - 1) * input.pageSize;
        const [items, total] = await Promise.all([
          prisma.document.findMany({
            where: { status: 'UPLOADED' },
            include: {
              organization: { select: { name: true } },
              shipment: { select: { id: true, status: true } },
            },
            orderBy: { uploadedAt: 'asc' },
            skip,
            take: input.pageSize,
          }),
          prisma.document.count({ where: { status: 'UPLOADED' } }),
        ]);
        return { items, total, page: input.page, pageSize: input.pageSize, totalPages: Math.ceil(total / input.pageSize) };
      }),

    approve: adminProcedure
      .input(z.object({ id: z.string(), notes: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const doc = await prisma.document.findUnique({ where: { id: input.id } });
        if (!doc) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' });

        const updated = await prisma.document.update({
          where: { id: input.id },
          data: { status: 'APPROVED', approvedAt: new Date(), notes: input.notes },
        });

        await prisma.auditLog.create({
          data: {
            actorId: ctx.user.sub,
            organizationId: doc.organizationId,
            action: 'DOCUMENT_APPROVED',
            resource: 'document',
            resourceId: doc.id,
          },
        });

        return updated;
      }),

    reject: adminProcedure
      .input(z.object({ id: z.string(), reason: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const doc = await prisma.document.findUnique({ where: { id: input.id } });
        if (!doc) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' });

        const updated = await prisma.document.update({
          where: { id: input.id },
          data: { status: 'REJECTED', notes: input.reason },
        });

        await prisma.outboxEvent.create({
          data: {
            topic: 'notification.whatsapp',
            payload: {
              template: 'document_rejected',
              organizationId: doc.organizationId,
              documentType: doc.type,
              reason: input.reason,
            },
          },
        });

        return updated;
      }),
  }),

  hsCode: router({
    queue: adminProcedure
      .input(z.object({ page: z.number().min(1).default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const skip = (input.page - 1) * input.pageSize;
        const [items, total] = await Promise.all([
          prisma.product.findMany({
            where: { aiHsCode: { not: null }, hsCode: null },
            include: { organization: { select: { name: true } } },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: input.pageSize,
          }),
          prisma.product.count({ where: { aiHsCode: { not: null }, hsCode: null } }),
        ]);
        return { items, total, page: input.page, pageSize: input.pageSize, totalPages: Math.ceil(total / input.pageSize) };
      }),

    approve: adminProcedure
      .input(
        z.object({
          productId: z.string(),
          hsCode: z.string().min(4),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const product = await prisma.product.update({
          where: { id: input.productId },
          data: { hsCode: input.hsCode },
        });

        await prisma.auditLog.create({
          data: {
            actorId: ctx.user.sub,
            organizationId: product.organizationId,
            action: 'HS_CODE_APPROVED',
            resource: 'product',
            resourceId: product.id,
            after: { hsCode: input.hsCode },
          },
        });

        return product;
      }),
  }),

  users: router({
    list: adminProcedure
      .input(z.object({ page: z.number().min(1).default(1), pageSize: z.number().default(20) }))
      .query(async ({ input }) => {
        const skip = (input.page - 1) * input.pageSize;
        const [items, total] = await Promise.all([
          prisma.user.findMany({
            select: { id: true, email: true, firstName: true, lastName: true, accountType: true, isActive: true, createdAt: true, lastLoginAt: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: input.pageSize,
          }),
          prisma.user.count(),
        ]);
        return { items, total, page: input.page, pageSize: input.pageSize, totalPages: Math.ceil(total / input.pageSize) };
      }),

    toggleActive: adminProcedure
      .input(z.object({ id: z.string(), isActive: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const user = await prisma.user.update({
          where: { id: input.id },
          data: { isActive: input.isActive },
        });
        await prisma.auditLog.create({
          data: {
            actorId: ctx.user.sub,
            action: input.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
            resource: 'user',
            resourceId: input.id,
          },
        });
        return user;
      }),
  }),
});
