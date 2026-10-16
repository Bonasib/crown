# Wilo AI — web studio

An AI video, image, voice and ad studio (`apps/web-studio`). Next.js 14 App Router, Tailwind, Radix/shadcn-style components, Lucide icons.

```bash
pnpm install --filter @crown/web-studio
cp apps/web-studio/.env.example apps/web-studio/.env.local   # add a key, or leave empty for demo mode
pnpm --filter @crown/web-studio dev                          # http://localhost:3010
```

## Generation backend

| Variable | Purpose |
|---|---|
| `REPLICATE_API_TOKEN` | Run models on Replicate |
| `FAL_KEY` | Run models on fal |
| `WILO_PROVIDER` | `replicate` (default) or `fal` when both keys are set |

With no key, the API runs in **demo mode**: jobs finish after ~4 s and return generated placeholder art, so every flow can be clicked through offline.

- `POST /api/generate` → `{ id, status }` · `GET /api/jobs/:id` → `{ status, outputs }`
- Model → provider endpoint and parameter mapping lives in `src/lib/catalog/models.ts`. Vendors rename endpoints and inputs often; adjust a model's `replicate` / `fal` route there if a call is rejected.

## Map

| Area | Routes |
|---|---|
| Create | `/image`, `/video`, `/edit`, `/character` (Persona), `/lipsync`, `/audio`, `/cinema`, `/ads` |
| Catalogs | `/presets` + `/presets/[slug]` (83 presets), `/apps` + `/apps/[slug]` (41 apps), `/models` |
| Community & account | `/explore`, `/library`, `/pricing`, `/login` |
| Company | `/roadmap`, `/developers`, `/about`, `/terms`, `/privacy` |

Catalog data (nav, presets, apps, models, plans, roadmap) is plain TypeScript in `src/lib/catalog/`. Cover art is procedural (`components/media/poster.tsx`), so no third-party imagery ships with the site.

## Not built yet

Accounts, Stripe billing and a server-side credit ledger are on `/roadmap`. Library and credits currently live in `localStorage`, and plan checkout is simulated. Persona sends your chosen photo as an identity reference; it does not fine-tune a model.
