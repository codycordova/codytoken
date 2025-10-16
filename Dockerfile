# Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++ linux-headers libc6-compat
WORKDIR /app

# Install with cache reuse
COPY package.json package-lock.json ./
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false \
    NEXT_TELEMETRY_DISABLED=1
RUN npm ci --no-fund --no-audit --omit=optional

# Build
COPY . .
RUN npm run build

# Runtime stage
FROM node:22-alpine AS runner

RUN apk add --no-cache dumb-init libc6-compat
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs
WORKDIR /app

ARG APP_PORT=3000
ARG WS_PORT=3030
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=${APP_PORT} \
    WS_PORT=${WS_PORT} \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --no-fund --no-audit --omit=dev --omit=optional

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE ${APP_PORT} ${WS_PORT}
ENTRYPOINT ["dumb-init", "--"]
CMD ["next", "start", "-p", "${PORT}"]