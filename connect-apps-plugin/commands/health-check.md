Check the health and connectivity of all Ronda Ship apps and services running locally.

## Steps

Run the following checks in order and report the status of each:

1. **API** — `curl -s http://localhost:4000/health`
   - Expected: `{"status":"ok","version":"0.1.0",...}`

2. **Web apps** — check if each Next.js dev server is responding:
   - web-saas: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
   - web-erp:  `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001`
   - web-crm:  `curl -s -o /dev/null -w "%{http_code}" http://localhost:3002`
   - web-admin: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3003`
   - Expected: HTTP 200

3. **Database** — check PostgreSQL is reachable:
   - `docker compose ps postgres` — should show "running"

4. **Redis** — check Redis is reachable:
   - `docker compose ps redis` — should show "running"

5. **CORS** — verify the API allows requests from the web apps:
   - Check that `CORS_ORIGINS` in `.env` includes all four localhost ports

6. Print a summary table:

```
Service      | Port | Status
-------------|------|--------
api          | 4000 | ✓ / ✗
web-saas     | 3000 | ✓ / ✗
web-erp      | 3001 | ✓ / ✗
web-crm      | 3002 | ✓ / ✗
web-admin    | 3003 | ✓ / ✗
postgres     | 5432 | ✓ / ✗
redis        | 6379 | ✓ / ✗
```

If any service is down, suggest the command to start it.
