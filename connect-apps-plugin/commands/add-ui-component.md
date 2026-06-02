Add a new shared UI component to `packages/ui` and use it in one or more apps.

## Steps

1. Ask the user for:
   - Component name (PascalCase, e.g. `TrackingTimeline`, `InvoiceTable`)
   - Which app(s) will use it: `web-saas`, `web-erp`, `web-crm`, `web-admin`
   - A description of the component's purpose and props

2. Create the component at `packages/ui/src/components/<ComponentName>.tsx`:
   - Use only CSS variable colors — `hsl(var(--primary))`, `hsl(var(--muted))`, etc. — **never** hardcode hex or Tailwind color classes like `text-teal-600`
   - Use Tailwind utility classes for spacing/layout
   - Accept a `className` prop and merge it with `cn()` from `clsx`/`tailwind-merge`
   - Export the component as a named export

3. Re-export from `packages/ui/src/index.ts` (the barrel file).

4. Show example usage in one of the target apps:
   ```tsx
   import { ComponentName } from '@ronda/ui';
   ```

5. If the component needs icons, use `lucide-react` — already a dependency in the web apps.

6. List all files created/modified.

## Project context

- `@ronda/ui` is the shared design system imported by all four web apps
- Each app sets its own theme via CSS custom properties in `src/app/globals.css`
- Existing components to reference: Button, Card, Input, Badge, Sidebar, StatCard, DataTable, PageHeader, ShipmentStatusBadge
- Do not add Radix UI, shadcn, or other component libraries without user approval
