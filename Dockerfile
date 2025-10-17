# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]