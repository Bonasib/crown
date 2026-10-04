#!/usr/bin/env bash
# One-shot setup for a fresh Ubuntu/Debian VPS. Run as root:
#   curl -fsSL https://raw.githubusercontent.com/Bonasib/crown/<branch>/deploy/install.sh | bash
# Safe to re-run: later runs pull the latest code and redeploy.
set -euo pipefail

DOMAIN="${DOMAIN:-nooi.ai}"
BRANCH="${BRANCH:-claude/festive-brahmagupta-08tfzr}"
REPO="${REPO:-https://github.com/Bonasib/crown.git}"
DIR="${DIR:-/opt/crown}"

say() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

[ "$(id -u)" -eq 0 ] || { echo "Please run as root." >&2; exit 1; }

say "Installing git and Docker"
command -v git >/dev/null || { apt-get update -y && apt-get install -y git; }
command -v docker >/dev/null || curl -fsSL https://get.docker.com | sh
systemctl enable --now docker >/dev/null 2>&1 || true

# Next.js builds need memory; add swap on small servers so they don't get killed.
if [ "$(free -m | awk '/^Mem:/{print $2}')" -lt 6000 ] && ! swapon --show | grep -q .; then
  say "Adding 4 GB swap"
  fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

if command -v ufw >/dev/null; then
  say "Opening firewall ports 22, 80, 443"
  ufw allow 22/tcp >/dev/null; ufw allow 80/tcp >/dev/null; ufw allow 443 >/dev/null
  ufw --force enable >/dev/null
fi

say "Fetching the code ($BRANCH)"
if [ -d "$DIR/.git" ]; then
  git -C "$DIR" fetch --depth 1 origin "$BRANCH"
  git -C "$DIR" checkout -B "$BRANCH" FETCH_HEAD
else
  git clone --depth 1 -b "$BRANCH" "$REPO" "$DIR"
fi
cd "$DIR"

SEED=""
if [ ! -f .env.production ]; then
  say "Generating secrets in $DIR/.env.production"
  umask 077
  cat > .env.production <<ENV
DOMAIN=$DOMAIN
POSTGRES_PASSWORD=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
LOG_LEVEL=info
ENV
  SEED="--seed"
fi

say "Building and starting (first time takes 10-20 minutes)"
./deploy/deploy.sh $SEED

IP="$(curl -fsS https://api.ipify.org || hostname -I | awk '{print $1}')"
say "Done. Checking DNS for $DOMAIN (this server is $IP)"
for h in "$DOMAIN" "www.$DOMAIN" "erp.$DOMAIN" "crm.$DOMAIN" "admin.$DOMAIN" "api.$DOMAIN"; do
  got="$(getent ahostsv4 "$h" | awk 'NR==1{print $1}')"
  if [ "$got" = "$IP" ]; then echo "  OK       $h"; else echo "  MISSING  $h -> add an A record pointing to $IP (currently: ${got:-none})"; fi
done
echo
echo "Open https://$DOMAIN once every line above says OK. HTTPS certificates are issued automatically."
