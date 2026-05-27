import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import type { JwtPayload, UserRole } from '@ronda/types';

export interface Context {
  user: JwtPayload | null;
  organizationId: string | null;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure — requires valid JWT
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

/**
 * Org-scoped procedure — requires org membership
 */
export const orgProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.organizationId) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Organization context required' });
  }
  return next({ ctx: { ...ctx, organizationId: ctx.organizationId } });
});

/**
 * Role-guarded procedure factory
 */
export function requireRoles(...roles: UserRole[]) {
  return protectedProcedure.use(({ ctx, next }) => {
    const userRoles = ctx.user?.roles ?? [];
    const hasRole = roles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Required role: ${roles.join(' or ')}`,
      });
    }
    return next({ ctx });
  });
}
