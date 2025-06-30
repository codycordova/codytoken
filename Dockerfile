FROM node:20-alpine

# Install Python, build tools, linux headers, and eudev-dev for libudev.h
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
