import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { authRoutes } from './routes/auth';
import { categoryRoutes } from './routes/categories';
import { productRoutes } from './routes/products';
import { smmProviderRoutes } from './routes/smmProviders';
import { smmServiceRoutes } from './routes/smmServices';
import { couponRoutes } from './routes/coupons';
import { orderRoutes } from './routes/orders';
import { settingsRoutes } from './routes/settings';
import { statsRoutes } from './routes/stats';

const server = Fastify({
  logger: {
    level: process.env['LOG_LEVEL'] ?? 'info',
    transport: process.env['NODE_ENV'] === 'development' ? { target: 'pino-pretty' } : undefined,
  },
});

async function bootstrap() {
  await server.register(helmet, { contentSecurityPolicy: false });
  await server.register(cors, {
    origin: process.env['SHOP_CORS_ORIGINS']?.split(',') ?? ['http://localhost:3010'],
    credentials: true,
  });
  await server.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  await server.register(authRoutes);
  await server.register(categoryRoutes);
  await server.register(productRoutes);
  await server.register(smmProviderRoutes);
  await server.register(smmServiceRoutes);
  await server.register(couponRoutes);
  await server.register(orderRoutes);
  await server.register(settingsRoutes);
  await server.register(statsRoutes);

  const port = parseInt(process.env['SHOP_API_PORT'] ?? '4100', 10);
  const host = process.env['HOST'] ?? '0.0.0.0';

  await server.listen({ port, host });
  console.log(`\n👑 Shop Admin API running at http://${host}:${port}\n`);
}

bootstrap().catch((err) => {
  console.error('Failed to start shop-api:', err);
  process.exit(1);
});
