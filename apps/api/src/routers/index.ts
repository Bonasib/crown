import { router } from '../trpc';
import { authRouter } from './auth';
import { shipmentsRouter } from './shipments';
import { quotesRouter } from './quotes';

export const appRouter = router({
  auth: authRouter,
  shipments: shipmentsRouter,
  quotes: quotesRouter,
});

export type AppRouter = typeof appRouter;
