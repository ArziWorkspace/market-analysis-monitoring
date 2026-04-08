# syntax=docker/dockerfile:1

# ============================================
# Market Analyzer - Production Dockerfile
# ============================================
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json bun.lock ./
COPY --from=oven/bun:1-alpine /usr/local/bin/bun /usr/local/bin/bun
RUN bun install

# ============================================
# Builder
# ============================================
FROM base AS builder
COPY --from=deps /app/node_modules node_modules
COPY . .

# Prisma generate (needs dummy DATABASE_URL for codegen)
ENV DATABASE_URL="postgresql://dummy: dummy@dummy:5432/dummy?schema=public"
RUN bunx prisma generate

# Build
RUN bun run build

# ============================================
# Runner
# ============================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
