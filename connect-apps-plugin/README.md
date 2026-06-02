# connect-apps-plugin

Claude Code plugin for the **Ronda Ship** monorepo. Provides slash commands for wiring together the apps, API, worker, and shared packages.

## Usage

```bash
claude --plugin-dir ./connect-apps-plugin
```

## Available commands

| Command | What it does |
|---------|-------------|
| `/add-router` | Add a new tRPC router to the API and connect it to frontend app(s) |
| `/add-page` | Add a new Next.js page to any of the four web apps |
| `/add-ui-component` | Add a shared component to `@ronda/ui` |
| `/add-shared-type` | Add a TypeScript type or enum to `@ronda/types` |
| `/add-worker-job` | Add a BullMQ background job to the worker |
| `/db-query` | Write or debug a Prisma query for the Ronda Ship schema |
| `/health-check` | Verify all apps, API, Postgres, and Redis are running |

## Project layout (quick reference)

```
apps/
  api/          → Fastify + tRPC v10 (port 4000)
  web-saas/     → Customer portal, teal theme (port 3000)
  web-erp/      → Operations, navy theme (port 3001)
  web-crm/      → Sales / CRM, amber theme (port 3002)
  web-admin/    → Super admin, purple theme (port 3003)
  worker/       → BullMQ background jobs
packages/
  ui/           → @ronda/ui — theme-agnostic components
  db/           → @ronda/db — Prisma client + schema
  core/         → @ronda/core — domain logic
  types/        → @ronda/types — shared TypeScript types
  config/       → @ronda/config — shared TS/ESLint/Tailwind config
```
