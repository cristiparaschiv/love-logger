# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl openssl-dev

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
# Note: Using npm install because package-lock.json doesn't exist
# For reproducible builds, generate package-lock.json and switch to: npm ci
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install dumb-init (proper signal handling) and OpenSSL for Prisma
RUN apk add --no-cache dumb-init openssl openssl-dev

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
# Note: Using npm install because package-lock.json doesn't exist
# For reproducible builds, generate package-lock.json and switch to: npm ci --only=production
# Note: tsx is needed to run the seed script
RUN npm install --omit=dev && npm install tsx

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy scripts for password management
COPY scripts ./scripts/

# Generate Prisma client in production stage
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p /app/uploads/vacations

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 3900

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3900/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Run with dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Start application (run migrations, seed, then start server)
CMD ["docker-entrypoint.sh"]
