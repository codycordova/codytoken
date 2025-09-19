# ---------- Build stage ----------
    FROM node:22-alpine AS builder
    RUN apk add --no-cache \
        python3 \
        make \
        g++ \
        linux-headers \
        libc6-compat
    WORKDIR /app
    COPY package.json package-lock.json* ./
    RUN npm ci --no-fund --no-audit --omit=optional
    COPY . .
    RUN npm run build
    
    # ---------- Runtime stage ----------
    FROM node:22-alpine AS runner
    RUN apk add --no-cache dumb-init libc6-compat
    RUN addgroup -S nodejs -g 1001 \
     && adduser -S nextjs -u 1001 -G nodejs
    ENV NODE_ENV=production
    ENV HOST=0.0.0.0
    ENV PORT=3000
    ENV WS_PORT=3030
    ENV NPM_CONFIG_UPDATE_NOTIFIER=false
    ENV NPM_CONFIG_FUND=false
    ENV NPM_CONFIG_AUDIT=false
    ENV NEXT_TELEMETRY_DISABLED=1
    WORKDIR /app
    COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
    RUN npm ci --no-fund --no-audit --omit=dev --omit=optional
    COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
    COPY --from=builder --chown=nextjs:nodejs /app/public ./public
    COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
    USER nextjs
    EXPOSE 3000 3030
    ENTRYPOINT ["dumb-init", "--"]
    CMD ["node_modules/.bin/next", "start", "-p", "3000"]    