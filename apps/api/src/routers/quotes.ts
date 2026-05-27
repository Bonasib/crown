import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { prisma } from '@ronda/db';
import { router, orgProcedure } from '../trpc';
import { calculateQuote } from '@ronda/core';

export const quotesRouter = router({
  list: orgProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const skip = (page - 1) * pageSize;

      const [items, total] = await Promise.all([
        prisma.quote.findMany({
          where: { organizationId: ctx.organizationId },
          skip,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
          include: { lineItems: true, cargos: true },
        }),
        prisma.quote.count({ where: { organizationId: ctx.organizationId } }),
      ]);

      return { items, total, page, pageSize, hasNext: skip + items.length < total, hasPrev: page > 1 };
    }),

  calculate: orgProcedure
    .input(
      z.object({
        mode: z.enum(['LCL', 'FCL', 'AIR', 'MULTIMODAL', 'RAIL']),
        originPortCode: z.string(),
        destPortCode: z.string(),
        goodsType: z.enum([
          'GENERAL', 'HAZARDOUS', 'PERISHABLE', 'FRAGILE_HIGH_VALUE',
          'AUTOMOTIVE', 'TEXTILES', 'MACHINERY', 'ELECTRONICS', 'FOOD',
          'CHEMICALS', 'FURNITURE', 'COSMETICS', 'MEDICAL_PHARMA',
          'CONSTRUCTION', 'AGRICULTURAL', 'ENERGY_SOLAR',
        ]),
        cargoItems: z.array(
          z.object({
            id: z.string(),
            sku: z.string().optional(),
            lengthCm: z.number().positive(),
            widthCm: z.number().positive(),
            heightCm: z.number().positive(),
            weightKg: z.number().positive(),
            qty: z.number().int().positive(),
            hsCode: z.string().optional(),
            value: z.object({ amount: z.number(), currency: z.string() }),
            goodsType: z.enum([
              'GENERAL', 'HAZARDOUS', 'PERISHABLE', 'FRAGILE_HIGH_VALUE',
              'AUTOMOTIVE', 'TEXTILES', 'MACHINERY', 'ELECTRONICS', 'FOOD',
              'CHEMICALS', 'FURNITURE', 'COSMETICS', 'MEDICAL_PHARMA',
              'CONSTRUCTION', 'AGRICULTURAL', 'ENERGY_SOLAR',
            ]),
          }),
        ),
        currency: z.string().default('USD'),
      }),
    )
    .query(async ({ input }) => {
      // Get base rate from trade lanes (simplified - uses default if not found)
      const baseRateMinor = 180000; // fallback $1,800 FCL
      return calculateQuote({ ...input, baseRateMinor });
    }),

  create: orgProcedure
    .input(
      z.object({
        mode: z.enum(['LCL', 'FCL', 'AIR', 'MULTIMODAL', 'RAIL']),
        originPortCode: z.string(),
        destPortCode: z.string(),
        goodsType: z.enum([
          'GENERAL', 'HAZARDOUS', 'PERISHABLE', 'FRAGILE_HIGH_VALUE',
          'AUTOMOTIVE', 'TEXTILES', 'MACHINERY', 'ELECTRONICS', 'FOOD',
          'CHEMICALS', 'FURNITURE', 'COSMETICS', 'MEDICAL_PHARMA',
          'CONSTRUCTION', 'AGRICULTURAL', 'ENERGY_SOLAR',
        ]),
        cargoValueMinor: z.number().int().positive(),
        currency: z.string().default('USD'),
        totalMinor: z.number().int(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const quote = await prisma.quote.create({
        data: {
          organizationId: ctx.organizationId,
          mode: input.mode as any,
          originPortCode: input.originPortCode,
          destPortCode: input.destPortCode,
          goodsType: input.goodsType as any,
          cargoValueMinor: input.cargoValueMinor,
          currency: input.currency,
          totalMinor: input.totalMinor,
          notes: input.notes,
          status: 'DRAFT',
        },
      });

      return quote;
    }),
});
