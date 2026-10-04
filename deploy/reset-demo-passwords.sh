#!/usr/bin/env bash
# Replace the demo accounts' public passwords (from prisma/seed.ts) with random ones
# and print the new ones once. Run on the VPS as root:
#   curl -fsSL https://raw.githubusercontent.com/Bonasib/crown/claude/festive-brahmagupta-08tfzr/deploy/reset-demo-passwords.sh | bash
set -euo pipefail
cd "${DIR:-/opt/crown}"

EMAILS=(admin@ronda.ship owner@acme-imports.com logistics@acme-imports.com owner@global-trade-co.com sales@ronda.ship)

# Must match hashPassword() in apps/api/src/routers/auth.ts.
hash() { printf '%s' "$1salt_ronda_2024" | sha256sum | awk '{print $1}'; }

echo
echo "New passwords (save them now, they are not stored anywhere else):"
echo
for email in "${EMAILS[@]}"; do
  pw="$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-16)"
  n="$(docker compose --env-file .env.production -f docker-compose.prod.yml exec -T postgres \
    psql -U ronda -d ronda_ship -tAc "UPDATE users SET \"passwordHash\" = '$(hash "$pw")' WHERE email = '$email' RETURNING 1" | grep -c 1 || true)"
  if [ "$n" -gt 0 ]; then printf '  %-30s %s\n' "$email" "$pw"; fi
done
echo
