FROM node:20-alpine AS base
RUN npm install -g pnpm@9.15.0

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/db/package.json ./packages/db/
COPY packages/core/package.json ./packages/core/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @ronda/api build

FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm@9.15.0
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/packages ./packages
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
