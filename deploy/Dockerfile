# One image recipe for every service in the monorepo.
#   APP=api|worker           -> runs src/index.ts with tsx (workspace packages ship as TypeScript)
#   APP=web-saas|web-erp|... -> builds the Next.js app and runs `next start`
FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm@9.15.0
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile && pnpm --filter @ronda/db db:generate

ARG APP
# NEXT_PUBLIC_* values are inlined into the browser bundle at build time.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN test -n "$APP" && test -d "apps/$APP" \
  && if [ -f "apps/$APP/next.config.js" ]; then pnpm --filter "./apps/$APP" build; fi

ENV NODE_ENV=production APP=$APP
WORKDIR /app/apps/$APP
CMD ["sh", "-c", "if [ -f next.config.js ]; then exec node_modules/.bin/next start -p \"${PORT:-3000}\"; else exec node --import tsx src/index.ts; fi"]
