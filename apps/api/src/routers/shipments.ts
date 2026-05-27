import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { prisma } from '@ronda/db';
import { router, orgProcedure, requireRoles } from '../trpc';

export const shipmentsRouter = router({
  list: orgProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
        status: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, status } = input;
      const skip = (page - 1) * pageSize;

      const where = {
        organizationId: ctx.organizationId,
        ...(status ? { status: status as any } : {}),
      };

      const [items, total] = await Promise.all([
        prisma.shipment.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
          include: {
            trackingEvents: { orderBy: { timestamp: 'desc' }, take: 1 },
            containers: true,
            _count: { select: { documents: true } },
          },
        }),
        prisma.shipment.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        pageSize,
        hasNext: skip + items.length < total,
        hasPrev: page > 1,
      };
    }),

  get: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const shipment = await prisma.shipment.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
        include: {
          containers: true,
          trackingEvents: { orderBy: { timestamp: 'desc' } },
          milestones: { orderBy: { order: 'asc' } },
          documents: true,
          inspectionReport: {
            include: { checkpoints: true, photos: true },
          },
          invoices: true,
        },
      });

      if (!shipment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Shipment not found' });
      }

      return shipment;
    }),

  updateStatus: requireRoles('OPS_MANAGER', 'OPS_AGENT', 'SUPER_ADMIN')
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          'DRAFT', 'QUOTED', 'BOOKED', 'CARGO_RECEIVED', 'INSPECTED',
          'STUFFED', 'CUSTOMS_EXPORT', 'IN_TRANSIT', 'TRANSHIPMENT',
          'CUSTOMS_IMPORT', 'ARRIVED', 'DELIVERED', 'CLOSED',
          'ON_HOLD', 'CANCELLED', 'EXCEPTION',
        ]),
        description: z.string().optional(),
        locationLabel: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const shipment = await prisma.shipment.findUnique({
        where: { id: input.id },
      });

      if (!shipment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Shipment not found' });
      }

      const [updated] = await prisma.$transaction([
        prisma.shipment.update({
          where: { id: input.id },
          data: { status: input.status as any },
        }),
        prisma.trackingEvent.create({
          data: {
            shipmentId: input.id,
            timestamp: new Date(),
            status: input.status as any,
            description: input.description ?? `Status updated to ${input.status}`,
            locationLabel: input.locationLabel,
            source: 'MANUAL',
            addedById: ctx.user?.sub,
          },
        }),
        prisma.auditLog.create({
          data: {
            actorId: ctx.user?.sub,
            organizationId: shipment.organizationId,
            action: 'SHIPMENT_STATUS_UPDATE',
            resource: 'shipment',
            resourceId: input.id,
            before: { status: shipment.status },
            after: { status: input.status },
          },
        }),
      ]);

      return updated;
    }),
});
