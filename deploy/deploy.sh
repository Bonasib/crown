#!/usr/bin/env bash
# Build and (re)start the production stack. Run from the repo root on the VPS:
#   ./deploy/deploy.sh            # build, sync DB schema, start everything
#   ./deploy/deploy.sh --seed     # same, then load the seed data (first deploy only)
#
# WARNING: the seed creates demo accounts whose passwords are in the repo
# (packages/db/prisma/seed.ts). Change or delete them before real users arrive.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.production ]; then
  echo "Missing .env.production: copy .env.production.example and fill it in." >&2
  exit 1
fi

compose() { docker compose --env-file .env.production -f docker-compose.prod.yml "$@"; }

compose build
compose up -d --wait postgres redis
# The repo has no Prisma migrations yet, so the schema is pushed directly.
compose run --rm --no-deps -w /app/packages/db api pnpm exec prisma db push --skip-generate
if [ "${1:-}" = "--seed" ]; then
  compose run --rm --no-deps -w /app/packages/db api pnpm exec tsx prisma/seed.ts
fi
compose up -d --remove-orphans
compose ps
