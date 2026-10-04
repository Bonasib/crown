# Deploying to a VPS

The whole platform runs on one Docker host behind Caddy, which serves HTTPS
with automatically renewed Let's Encrypt certificates.

| Hostname          | Service     |
|-------------------|-------------|
| `DOMAIN`          | `web-saas`  |
| `www.DOMAIN`      | redirect to `DOMAIN` |
| `erp.DOMAIN`      | `web-erp`   |
| `crm.DOMAIN`      | `web-crm`   |
| `admin.DOMAIN`    | `web-admin` |
| `api.DOMAIN`      | `api`       |

Postgres and Redis are not exposed outside the Docker network.

## First deploy

Quickest: on a fresh Ubuntu VPS, as root, run

```bash
curl -fsSL https://raw.githubusercontent.com/Bonasib/crown/claude/festive-brahmagupta-08tfzr/deploy/install.sh | bash
```

It installs Docker, clones the repo to `/opt/crown`, generates secrets, deploys,
and reports which DNS records are still missing. Re-run it to update.

Manual steps:

1. **DNS.** Create an `A` record for `@`, `www`, `erp`, `crm`, `admin` and `api`,
   each pointing at the VPS IPv4 address. Caddy can only get certificates once
   these resolve.
2. **Server.** Install Docker with the Compose plugin, and open ports 80 and 443.
3. **Code.** Clone this repository onto the server.
4. **Secrets.** `cp .env.production.example .env.production`, then fill it in.
   Generate each secret with `openssl rand -hex 32`.
5. **Start.** `./deploy/deploy.sh --seed` (drop `--seed` if you don't want the
   demo data; see the warning in `deploy.sh`).

## Updating

```bash
git pull
./deploy/deploy.sh
```

The script rebuilds the images, syncs the database schema with
`prisma db push`, and restarts whatever changed.

## Useful commands

```bash
alias dc='docker compose --env-file .env.production -f docker-compose.prod.yml'
dc ps
dc logs -f api
dc exec postgres psql -U ronda ronda_ship
```

Back up the `postgres_data` volume (or run `pg_dump` on a schedule) before
relying on this in production.
