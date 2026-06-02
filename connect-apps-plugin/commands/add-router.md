Add a new tRPC router to the Ronda Ship API and wire it up to the relevant frontend app(s).

## Steps

1. Ask the user for:
   - Router name (e.g. `contacts`, `invoices`, `vessels`)
   - Which web app(s) need to call it: `web-saas`, `web-erp`, `web-crm`, `web-admin`
   - A brief description of what the router should do

2. Create `apps/api/src/routers/<name>.ts` following this pattern:
   - Import `router`, `protectedProcedure`, `orgProcedure` from `../trpc`
   - Import zod for input validation
   - Import `@ronda/db` prisma client if DB access is needed
   - Export a `<name>Router` const using `router({ ... })`
   - Use `orgProcedure` for tenant-scoped queries (always filter by `ctx.organizationId`)
   - Use `protectedProcedure` for non-tenant actions
   - All monetary values must be integers (minor units / cents) — never floats

3. Register the new router in `apps/api/src/routers/index.ts`:
   - Import and add it to the `appRouter` object

4. For each target web app, create or update the tRPC client usage:
   - The web apps do not yet have a tRPC client set up; if one is missing, scaffold `src/lib/trpc.ts` with a vanilla tRPC client pointing to `http://localhost:4000/trpc`
   - Show the user how to call the new procedure from a React component or server component

5. Show a summary of files created/modified.

## Project context

- API is Fastify + tRPC v10 at `apps/api/` (port 4000)
- Web apps are Next.js 14 at ports 3000–3003
- Shared types live in `packages/types/`
- DB access via `@ronda/db` (Prisma)
- All queries must include `organizationId` for multi-tenancy (ADR-005)
