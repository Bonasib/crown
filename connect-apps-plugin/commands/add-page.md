Add a new page to one of the Ronda Ship web apps, wired up to the API via tRPC.

## Steps

1. Ask the user for:
   - Target app: `web-saas` (port 3000), `web-erp` (port 3001), `web-crm` (port 3002), or `web-admin` (port 3003)
   - Route path (e.g. `/shipments/[id]/edit`, `/deals/new`)
   - Page purpose and key data it should display or mutate

2. Create the Next.js App Router page at `apps/<app>/src/app/<route>/page.tsx`:
   - Use the app's theme (each app has its own `--primary` CSS variable)
   - Import shared components from `@ronda/ui` — never hardcode colors; use `hsl(var(--primary))`
   - For data fetching, prefer server components with direct fetch or tRPC server-side calls
   - For mutations, use a client component with a form

3. If the page needs data not yet exposed by the API, prompt the user to run `/add-router` first, or scaffold a placeholder with a TODO comment.

4. Wire up navigation: if the app has a sidebar, add a link to the new page.

5. Show a summary of files created/modified and how to view the page in dev mode.

## App theme map

| App | Primary color | CSS variable |
|-----|--------------|--------------|
| `web-saas` | Teal #0D9488 | `--primary: 175 84% 32%` |
| `web-erp` | Steel Navy #1E3A5F | `--primary: 214 52% 24%` |
| `web-crm` | Amber #D97706 | `--primary: 38 92% 50%` |
| `web-admin` | Deep Purple #4C1D95 | `--primary: 263 80% 35%` |

## Project context

- All web apps use Next.js 14 App Router
- Shared UI components: `@ronda/ui` (Button, Card, Input, Badge, Sidebar, StatCard, DataTable, PageHeader)
- Do not add new third-party UI libraries without checking `packages/ui/package.json` first
