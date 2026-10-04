#!/usr/bin/env bash
# Delete the seeded demo companies and their data, keeping admin@ronda.ship and the
# reference data (see remove-demo-data.sql). Run on the VPS as root:
#   curl -fsSL https://raw.githubusercontent.com/Bonasib/crown/claude/festive-brahmagupta-08tfzr/deploy/remove-demo-data.sh | bash
set -euo pipefail
SQL_URL="https://raw.githubusercontent.com/Bonasib/crown/claude/festive-brahmagupta-08tfzr/deploy/remove-demo-data.sql"
cd "${DIR:-/opt/crown}"

curl -fsSL "$SQL_URL" | docker compose --env-file .env.production -f docker-compose.prod.yml \
  exec -T postgres psql -U ronda -d ronda_ship -q -t
