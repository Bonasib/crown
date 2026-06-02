Add a new BullMQ background job to `apps/worker` and connect it to an API trigger if needed.

## Steps

1. Ask the user for:
   - Job name (kebab-case, e.g. `document-generator`, `booking-confirmation`)
   - Queue it belongs to (existing: `email-notifications`, `vessel-tracker`, `fx-rate-sync`; or create new)
   - Trigger: scheduled (cron), event-driven (triggered from API), or both
   - Job payload shape

2. Create or update the worker file at `apps/worker/src/workers/<queue>.ts`:
   - Export a BullMQ `Worker` instance
   - Handle the new job name in the `switch` / `if` block
   - Jobs must be **idempotent** — safe to run more than once with the same payload

3. If event-driven, add a helper in `apps/api/src/` to enqueue the job when the relevant API action occurs (e.g. after booking is created).

4. If scheduled, register the repeat config in the worker bootstrap (check existing cron jobs for the pattern).

5. Add a TypeScript interface for the job payload in `packages/types` or inline in the worker file.

6. Show a summary of files created/modified.

## Project context

- Worker uses BullMQ with Redis backend
- Redis connection config comes from env vars (see `.env.example`)
- All jobs should be idempotent (ADR-006)
- Do not use `setTimeout`/`setInterval` for scheduling — use BullMQ repeat jobs
