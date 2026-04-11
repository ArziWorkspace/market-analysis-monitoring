# ============================================
# Stage 1: Build
# ============================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lockb ./

# Install dependencies (using bun)
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN bun run db:generate

# Build Next.js app
RUN bun run build

# ============================================
# Stage 2: Runtime
# ============================================
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Install node runtime for standalone output
RUN bun add -g node@20 && \
    ln -sf /usr/local/bin/node /usr/local/bin/node && \
    ln -sf /usr/local/lib/node_modules/node/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm

# Copy built standalone app from builder
COPY --from=builder /app/.next/standalone ./

# Copy required Next.js assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy prisma schema and generated client
COPY --from=builder /app/prisma ./prisma

# Copy .env for environment variables
# NOTE: For production, use Docker secrets or env vars at runtime
COPY --from=builder /app/.env ./.env

# Expose port
EXPOSE 3001

# Run with node (standalone output doesn't work with 'next start')
CMD ["node", "server.js"]
