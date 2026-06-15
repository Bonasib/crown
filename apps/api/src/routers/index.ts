import { router } from '../trpc';
import { authRouter } from './auth';
import { registrationRouter } from './registration';
import { shipmentsRouter } from './shipments';
import { quotesRouter } from './quotes';
import { productsRouter } from './products';
import { warehouseRouter } from './warehouse';
import { adminRouter } from './admin';
import { importerRouter } from './importer';

export const appRouter = router({
  auth: authRouter,
  registration: registrationRouter,
  shipments: shipmentsRouter,
  quotes: quotesRouter,
  products: productsRouter,
  warehouse: warehouseRouter,
  admin: adminRouter,
  importer: importerRouter,
});

export type AppRouter = typeof appRouter;
