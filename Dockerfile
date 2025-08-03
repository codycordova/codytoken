FROM node:20-alpine

# Install Python, build tools, linux headers, eudev-dev, and PM2
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev

# Set working directory
WORKDIR /app

# Set environment variables to fix Fly.io proxy warning
ENV HOST=0.0.0.0
ENV PORT=3000
ENV WS_PORT=3030

# Copy and install dependencies
COPY package.json package-lock.json* ./
RUN npm install
RUN npm install -g pm2

# Copy all files and build the Next.js app
COPY . .
RUN npm run build

# Expose both ports
EXPOSE 3000 3030

# Start the app
CMD ["npm", "start"]
