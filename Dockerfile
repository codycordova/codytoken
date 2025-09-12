# Multi-stage build for security and optimization
# Stage 1: Build stage
FROM node:20-alpine AS builder

# Install system dependencies and security updates
RUN apk update && apk upgrade && \
    apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers \
    eudev-dev && \
    rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Set environment variables for build
ENV NODE_ENV=production
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json* ./

# Update npm to latest version and install ALL dependencies (including dev) for build
RUN npm install -g npm@latest && \
    npm ci --no-audit --no-fund && \
    npm audit --audit-level=moderate

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS runner

# Install system dependencies and security updates
RUN apk update && apk upgrade && \
    apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers \
    eudev-dev \
    dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Set environment variables for security and performance
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV WS_PORT=3030
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

# Copy package files and install ONLY production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production --no-audit --no-fund && \
    npm install -g pm2@latest

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

# Switch to non-root user
USER nextjs

# Expose ports
EXPOSE 3000 3030

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]
