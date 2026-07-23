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

## Telegram Digital Goods & SMM Shop Bot

A separate product living in this monorepo: a Telegram bot that sells digital
products (gift cards, keys, files) and social-media growth (SMM) services,
paid for with Telegram Stars (XTR).

| App | Port | Purpose |
|-----|------|---------|
| `telegram-bot` | — | The bot itself (grammY, long polling) |
| `shop-api` | 4100 | Fastify REST API behind the admin panel |
| `shop-admin` | 3010 | Next.js admin panel (Gold/Black "Crown" theme) |

It has its own database (`packages/shop-db`, `SHOP_DATABASE_URL`), separate
from the freight platform's `packages/db` — the two domains don't share
tables.

### Features

- **Catalog**: admin-managed digital products, capped at 200 entries, each
  editable/deletable. Delivery via a static text message, a hosted file URL,
  or a pool of one-time keys/codes (claimed atomically per order). `sourceType`
  can be tagged `G2A`, and `packages/shop-core`'s `lookupG2aProduct()` will
  opportunistically check G2A's Integration API for price/stock — G2A's API
  is seller/listing-oriented, not a generic buy-and-resell endpoint, so this
  is never required for checkout to work.
- **SMM services**: also capped at 200, each pointing at a generic
  "JAP-standard" SMM panel provider (`packages/shop-core/smmProvider.ts`) —
  the de facto API shape most SMM panels expose. Buyers submit a profile/post
  link and a quantity; the bot places the order with the provider after
  payment and lets buyers re-check status from `/myorders`.
- **Payment**: Telegram Stars (currency `XTR`) via `sendInvoice` /
  `pre_checkout_query` / `successful_payment` — no external payment gateway.
  Stars have no fixed real-world exchange rate, so pricing is
  `cost × (1 + profit%) × stars_per_usd`, where both the global profit % and
  the USD→Stars rate are admin-configurable (Settings page).
- **Delivery**: after payment, the bot posts the product both as a chat
  message and as a downloadable file, with progress messages at each step
  (payment confirmed → preparing → delivered).
- **Coupons**: percent/fixed discount codes, with a usage limit and
  expiry. A coupon can also be marked `AFFILIATE` and tied to a Telegram
  user ID + commission %; when redeemed, the affiliate is credited Stars
  and notified in their own chat with the bot.
- **Languages**: Arabic (default) and English, switchable per user from the
  bot menu; the admin panel has the same toggle.

### Running it locally

```bash
cp .env.example .env   # fill in TELEGRAM_BOT_TOKEN, ADMIN_JWT_SECRET, SHOP_DATABASE_URL
pnpm shop:db:push
pnpm shop:db:seed      # creates default settings + an admin login (see SEED_ADMIN_* in .env)
pnpm --filter @ronda/telegram-bot dev
pnpm --filter @ronda/shop-api dev
pnpm --filter @ronda/shop-admin dev   # http://localhost:3010
```

G2A and SMM provider credentials are entered through the admin panel
(Settings / SMM → Providers) rather than env vars, so they can be rotated
without a redeploy.

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
