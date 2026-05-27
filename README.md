# Ronda Ship

A modern freight-forwarding platform for China-to-MENA/US shipments. Phase 0 foundations.

## Applications

| App | Port | Theme | Purpose |
|-----|------|-------|---------|
| `web-saas` | 3000 | Teal | Customer portal — book & track shipments |
| `web-erp` | 3001 | Steel Navy | Operations — manage all shipments & finance |
| `web-crm` | 3002 | Amber | Sales — leads, deals, CRM pipeline |
| `web-admin` | 3003 | Deep Purple | Super admin — orgs, users, feature flags |
| `api` | 4000 | — | tRPC + Fastify backend |
| `worker` | — | — | BullMQ background jobs |

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Docker + Docker Compose

## Quick Start

### 1. Clone and install

```bash
git clone <repo>
cd crown
pnpm install
```

### 2. Start infrastructure

```bash
# Start PostgreSQL + Redis
docker compose up postgres redis -d
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL, etc.
```

### 4. Set up database

```bash
# Push schema to database
pnpm db:push

# Seed with test data
pnpm db:seed
```

### 5. Start development

```bash
# Start all apps + API
pnpm dev
```

Or start individual apps:

```bash
pnpm --filter @ronda/web-saas dev   # Customer portal → http://localhost:3000
pnpm --filter @ronda/web-erp dev    # ERP → http://localhost:3001
pnpm --filter @ronda/web-crm dev    # CRM → http://localhost:3002
pnpm --filter @ronda/web-admin dev  # Admin → http://localhost:3003
pnpm --filter @ronda/api dev        # API → http://localhost:4000
```

## Test Credentials

After seeding (`pnpm db:seed`):

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@ronda.ship | Admin123! |
| ACME Owner | owner@acme-imports.com | Owner123! |
| ACME Booker | logistics@acme-imports.com | Booker123! |
| Sales Rep | sales@ronda.ship | Sales123! |

## Separate Themes

Each app has its own theme injected via CSS custom properties in `src/app/globals.css`:

- **web-saas**: `--primary: 175 84% 32%` (Teal #0D9488)
- **web-erp**: `--primary: 214 52% 24%` (Steel Navy #1E3A5F)
- **web-crm**: `--primary: 38 92% 50%` (Amber #D97706)
- **web-admin**: `--primary: 263 80% 35%` (Deep Purple #4C1D95)

The `@ronda/ui` components use only `hsl(var(--primary))` — no hardcoded colors.

## Project Structure

```
crown/
├── apps/
│   ├── web-saas/     # Next.js 14, teal theme
│   ├── web-erp/      # Next.js 14, navy theme
│   ├── web-crm/      # Next.js 14, amber theme
│   ├── web-admin/    # Next.js 14, purple theme
│   ├── api/          # Fastify + tRPC
│   └── worker/       # BullMQ workers
├── packages/
│   ├── ui/           # Shared component library
│   ├── db/           # Prisma schema + client
│   ├── core/         # Domain logic (quoting, packing, compliance)
│   ├── config/       # Shared configs
│   └── types/        # TypeScript types
├── docs/
│   └── erd.md        # Mermaid ER diagram
├── DECISIONS.md      # Architecture decisions
├── CHANGELOG.md      # Change history
└── docker-compose.yml
```

## Development Commands

```bash
pnpm build          # Build all packages
pnpm dev            # Start all in dev mode
pnpm lint           # Run ESLint
pnpm typecheck      # TypeScript check
pnpm test           # Run all tests
pnpm db:push        # Push Prisma schema
pnpm db:seed        # Seed database
pnpm db:migrate     # Run migrations
```

## API

The tRPC API is at `http://localhost:4000/trpc`.

### Authentication

```bash
# Login
curl -X POST http://localhost:4000/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{"json": {"email": "owner@acme-imports.com", "password": "Owner123!"}}'
```

### Protected Endpoints

Pass `Authorization: Bearer <access_token>` and `X-Org-Id: <org_id>` headers.

## Docker

```bash
# Start everything
docker compose up -d

# View logs
docker compose logs -f api

# Stop
docker compose down
```
