# Architecture Decision Records

## ADR-001: Monorepo with pnpm + Turborepo

**Status:** Accepted

**Context:** Multiple apps share code (types, UI components, domain logic, database client). Need efficient builds with caching.

**Decision:** pnpm workspaces for dependency management, Turborepo for task orchestration and build caching.

**Consequences:**
- Shared `packages/` can be imported with `workspace:*`
- `turbo run build` builds only changed packages
- Single lock file, consistent dependency versions

---

## ADR-002: Separate Themes per App via CSS Custom Properties

**Status:** Accepted

**Context:** Four apps serve different user personas (customers, ops, sales, admin) and should have distinct visual identities while sharing the same component library.

**Decision:** Each app defines its own CSS custom properties (`--primary`, `--accent`, etc.) in its `globals.css`. The `@ronda/ui` component library uses only CSS variables — never hardcoded colors. This means the same `<Button>` component renders teal in web-saas, navy in web-erp, amber in web-crm, and violet in web-admin.

**Theme Map:**
- `web-saas`: Teal (#0D9488) — clean and professional for customer-facing
- `web-erp`: Steel Navy (#1E3A5F) — authoritative for operations staff
- `web-crm`: Amber (#D97706) — energetic for sales teams
- `web-admin`: Deep Purple (#4C1D95) — distinctive for platform admins

**Consequences:**
- No theme-switching complexity (each app IS a theme)
- Components are truly theme-agnostic
- Easy to add dark mode per-app in future

---

## ADR-003: Integer Minor Units for Money

**Status:** Accepted

**Context:** Floating-point arithmetic causes rounding errors in financial calculations.

**Decision:** All monetary values stored as `Int` in Prisma (minor units: cents, halalas). Field naming convention: `amountMinor`, `totalMinor`, `baseRateMinor`.

**Consequences:**
- `$2,850.00` is stored as `285000`
- Division by 100 only at display layer
- `formatMinorUnits()` helper in `@ronda/core/accounting`

---

## ADR-004: tRPC for Type-Safe API

**Status:** Accepted

**Context:** All frontends are TypeScript + React. Need type safety across API boundary without manual type generation.

**Decision:** tRPC v10 with Fastify adapter. Each router defines input/output types with Zod. Frontend apps can import `AppRouter` type for fully type-safe calls.

**Consequences:**
- No OpenAPI spec (trade-off: harder for external consumers)
- Excellent DX for internal frontends
- `@trpc/server` adapters available for Fastify + Next.js API routes

---

## ADR-005: Multi-tenancy via Application-Level Row Scoping

**Status:** Accepted

**Context:** All tenant data must be isolated. Options: separate DB per tenant, schema-per-tenant, or application-level filtering.

**Decision:** Single database, single schema, application-level scoping. All queries include `organizationId` in WHERE clause. The `Membership` table controls which users can access which organizations.

**Consequences:**
- Simpler operations (one DB to manage)
- Requires disciplined WHERE clause usage (mitigated by repository layer)
- `orgProcedure` in tRPC enforces org context at middleware level

---

## ADR-006: BullMQ for Background Jobs

**Status:** Accepted

**Context:** Need reliable background job processing for emails, vessel tracking, document generation, FX rate sync.

**Decision:** BullMQ with Redis backend. Named queues per job type. Repeat/cron scheduling for recurring jobs.

**Consequences:**
- Requires Redis (already needed for sessions/caching)
- BullBoard UI can be added for visibility
- Jobs are idempotent by design

---

## ADR-007: Prisma ORM

**Status:** Accepted

**Context:** Need type-safe database access, migrations, and seeding for PostgreSQL.

**Decision:** Prisma v6 with PostgreSQL. Schema-first approach. Generated client published from `@ronda/db`.

**Consequences:**
- Auto-generated TypeScript types from schema
- `prisma migrate dev` for development
- `prisma migrate deploy` for production
- Seed script provides reproducible test data
