import { PrismaClient } from '../prisma/generated/client';

const globalForPrisma = globalThis as unknown as {
  shopPrisma: PrismaClient | undefined;
};

export const shopPrisma =
  globalForPrisma.shopPrisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env['NODE_ENV'] !== 'production') globalForPrisma.shopPrisma = shopPrisma;

export { Prisma } from '../prisma/generated/client';
