# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies (including dev dependencies for build)
# Using npm install instead of npm ci for better compatibility with peer deps
RUN npm install --ignore-scripts --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies + TypeScript (needed for next.config.ts at runtime)
# Using npm install instead of npm ci for better compatibility with peer deps
RUN npm install --omit=dev --ignore-scripts --legacy-peer-deps && \
    npm install --save-prod typescript@^5.9.2 --ignore-scripts --legacy-peer-deps

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Next.js config and other necessary files
COPY --from=builder --chown=nextjs:nodejs /app/next.config.* ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Ensure node_modules is owned by nextjs user (fixes permission issues)
RUN chown -R nextjs:nodejs /app/node_modules

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["npm", "start"]