# ============================================
# Stage 1: Build
# ============================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build Next.js app
RUN bun run build

# ============================================
# Stage 2: Runtime (Node.js)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built standalone app from builder
COPY --from=builder /app/.next/standalone ./

# Copy required Next.js assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy .env
COPY --from=builder /app/.env ./.env

# Expose port
EXPOSE 3001

# Run standalone server (bind to 0.0.0.0 for external access)
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]
