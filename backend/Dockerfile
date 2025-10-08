# Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma Client
RUN npx prisma generate

# Production image
FROM base AS runner
WORKDIR /app

# Create app user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 rankedvote

# Copy node_modules from deps
COPY --from=deps --chown=rankedvote:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=rankedvote:nodejs /app/prisma ./prisma

# Copy application code
COPY --chown=rankedvote:nodejs . .

# Create directories for uploads and config
RUN mkdir -p /app/uploads /app/config
RUN chown -R rankedvote:nodejs /app/uploads /app/config

# Switch to app user
USER rankedvote

# Expose API port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if(r.statusCode !== 200) throw new Error('Health check failed')})"

# Start application
CMD ["npm", "start"]
