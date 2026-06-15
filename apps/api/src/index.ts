import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './routers';
import { verifyToken, extractTokenFromHeader } from './middleware/auth';

const server = Fastify({
  logger: {
    level: process.env['LOG_LEVEL'] ?? 'info',
    transport:
      process.env['NODE_ENV'] === 'development'
        ? { target: 'pino-pretty' }
        : undefined,
  },
});

async function bootstrap() {
  // Security
  await server.register(helmet, { contentSecurityPolicy: false });
  await server.register(cors, {
    origin: process.env['CORS_ORIGINS']?.split(',') ?? [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
    ],
    credentials: true,
  });

  // Health check
  server.get('/health', async () => ({
    status: 'ok',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  }));

  // tRPC
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: async ({ req }: { req: { headers: Record<string, string | string[] | undefined> } }) => {
        const authHeader = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        const user = token ? verifyToken(token) : null;
        const rawOrgId = req.headers['x-org-id'];
        const orgId = Array.isArray(rawOrgId) ? rawOrgId[0] : rawOrgId;

        return {
          user,
          organizationId: user?.orgId ?? orgId ?? null,
        };
      },
    },
  });

  const port = parseInt(process.env['PORT'] ?? '4000', 10);
  const host = process.env['HOST'] ?? '0.0.0.0';

  await server.listen({ port, host });
  console.log(`\n🚢 Ronda Ship API running at http://${host}:${port}`);
  console.log(`   tRPC endpoint: http://${host}:${port}/trpc`);
  console.log(`   Health check:  http://${host}:${port}/health\n`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
