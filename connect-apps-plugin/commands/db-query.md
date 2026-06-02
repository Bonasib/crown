Write or debug a Prisma database query for the Ronda Ship schema.

## Steps

1. Ask the user what data they need to fetch or mutate (e.g. "get all open shipments for an org", "create an invoice with line items").

2. Locate the relevant Prisma models in `packages/db/prisma/schema.prisma`.

3. Write the Prisma query:
   - Always filter by `organizationId` for tenant-scoped models (ADR-005)
   - Use `select` or `include` to avoid over-fetching
   - For financial calculations, remember all money fields end in `Minor` and are integers (ADR-003)
   - Use transactions (`prisma.$transaction`) for operations that must be atomic

4. Show where to place the query — typically inside a tRPC router procedure in `apps/api/src/routers/`.

5. If the query requires a schema change (new field, new model), explain what Prisma migration command to run:
   ```bash
   pnpm db:migrate   # or pnpm db:push for dev
   ```

6. Optionally generate a TypeScript type for the result shape using Prisma's `Prisma.<Model>GetPayload<...>` helper.

## Project context

- Prisma client is imported from `@ronda/db`
- Schema file: `packages/db/prisma/schema.prisma`
- All tenant data must be scoped with `organizationId` in WHERE clauses
- Money stored as minor units (cents) — display layer divides by 100 using `formatMinorUnits()` from `@ronda/core/accounting`
