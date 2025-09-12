import Link from 'next/link';
import '../Docs.css';

export default function DeploymentPage() {
  return (
    <div className="docs-container">
      <div className="docs-sidebar">
        <div className="docs-logo">
          <h2>CODY Token Docs</h2>
        </div>
        <nav className="docs-nav">
          <ul>
            <li><Link href="/docs">Welcome</Link></li>
            <li><Link href="/docs/api-reference">API Reference</Link></li>
            <li><Link href="/docs/tokenomics">Tokenomics</Link></li>
            <li><Link href="/docs/integration">Integration Guide</Link></li>
            <li><Link href="/docs/stellar">Stellar Integration</Link></li>
            <li><Link href="/docs/aqua">Aqua AMM Integration</Link></li>
            <li><Link href="/docs/deployment" className="active">Deployment</Link></li>
          </ul>
        </nav>
      </div>
      
      <div className="docs-content">
        <div className="docs-header">
          <h1>Deployment</h1>
          <p className="docs-subtitle">
            Guide to deploying applications that integrate with CODY Token APIs, 
            self-hosting your own CODY-powered services, and production setup.
          </p>
        </div>

        <div className="docs-section">
          <h2>🚀 Quick Deployment</h2>
          <p>Deploy your CODY Token-integrated applications to production:</p>
          
          <div className="deployment-grid">
            <div className="deployment-card">
              <h3>Fly.io (Recommended)</h3>
              <p>Deploy your CODY-integrated app to Fly.io</p>
              <div className="code-block">
                <pre><code>{`# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy your app
fly deploy

# Check status
fly status`}</code></pre>
              </div>
            </div>
            
            <div className="deployment-card">
              <h3>Docker</h3>
              <p>Deploy your app using Docker containers</p>
              <div className="code-block">
                <pre><code>{`# Build image
docker build -t my-cody-app .

# Run container
docker run -p 3000:3000 my-cody-app`}</code></pre>
              </div>
            </div>
            
            <div className="deployment-card">
              <h3>Vercel</h3>
              <p>Deploy your app to Vercel platform</p>
              <div className="code-block">
                <pre><code>{`# Install Vercel CLI
npm i -g vercel

# Deploy your app
vercel --prod`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>⚙️ Environment Configuration</h2>
          <p>Configure environment variables for your CODY-integrated application:</p>
          
          <div className="code-block">
            <pre><code>{`# Stellar Configuration
STELLAR_HORIZON_URL=https://horizon.stellar.org
STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015

# CODY Token Configuration
CODY_ISSUER=GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK
CODY_ASSET_CODE=CODY

# Soroban Configuration
SOROBAN_RPC_URL=https://mainnet.sorobanrpc.com

# Token Contract IDs (for Soroban integration)
CODY_TOKEN_CONTRACT=<CODY_TOKEN_CONTRACT_ID>
USDC_TOKEN_CONTRACT=<USDC_TOKEN_CONTRACT_ID>
AQUA_TOKEN_CONTRACT=<AQUA_TOKEN_CONTRACT_ID>

# Optional: Your app's base URL
NEXT_PUBLIC_BASE_URL=https://your-app.com`}</code></pre>
          </div>
        </div>

        <div className="docs-section">
          <h2>🐳 Docker Configuration</h2>
          <p>Deploy your CODY-integrated app using Docker:</p>
          
          <div className="docker-grid">
            <div className="docker-card">
              <h3>Dockerfile</h3>
              <div className="code-block">
                <pre><code>{`FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`}</code></pre>
              </div>
            </div>
            
            <div className="docker-card">
              <h3>Docker Compose</h3>
              <div className="code-block">
                <pre><code>{`version: '3.8'

services:
  codytoken-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - STELLAR_HORIZON_URL=https://horizon.stellar.org
      - CODY_ISSUER=GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK
      - CODY_ASSET_CODE=CODY
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/price"]
      interval: 30s
      timeout: 10s
      retries: 3`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>☁️ Cloud Platform Deployment</h2>
          
          <div className="cloud-grid">
            <div className="cloud-card">
              <h3>Fly.io</h3>
              <p>Deploy to Fly.io with automatic scaling and global CDN</p>
              <div className="code-block">
                <pre><code>{`# fly.toml configuration
app = "codytoken-api"
primary_region = "iad"

[build]

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256

[env]
  NODE_ENV = "production"
  STELLAR_HORIZON_URL = "https://horizon.stellar.org"
  CODY_ISSUER = "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK"`}</code></pre>
              </div>
            </div>
            
            <div className="cloud-card">
              <h3>AWS</h3>
              <p>Deploy to AWS using ECS or Lambda</p>
              <div className="code-block">
                <pre><code>{`# AWS ECS Task Definition
{
  "family": "codytoken-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "codytoken-api",
      "image": "your-registry/codytoken-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}`}</code></pre>
              </div>
            </div>
            
            <div className="cloud-card">
              <h3>Google Cloud</h3>
              <p>Deploy to Google Cloud Run</p>
              <div className="code-block">
                <pre><code>{`# Deploy to Cloud Run
gcloud run deploy codytoken-api \\
  --source . \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --set-env-vars NODE_ENV=production \\
  --set-env-vars STELLAR_HORIZON_URL=https://horizon.stellar.org`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔧 Production Optimization</h2>
          
          <div className="optimization-grid">
            <div className="optimization-card">
              <h3>Performance</h3>
              <ul>
                <li>Enable gzip compression</li>
                <li>Configure CDN for static assets</li>
                <li>Implement response caching</li>
                <li>Use connection pooling</li>
                <li>Monitor response times</li>
              </ul>
            </div>
            
            <div className="optimization-card">
              <h3>Security</h3>
              <ul>
                <li>Enable HTTPS/TLS</li>
                <li>Configure CORS properly</li>
                <li>Implement rate limiting</li>
                <li>Use environment variables</li>
                <li>Regular security updates</li>
              </ul>
            </div>
            
            <div className="optimization-card">
              <h3>Monitoring</h3>
              <ul>
                <li>Set up health checks</li>
                <li>Monitor API response times</li>
                <li>Track error rates</li>
                <li>Log important events</li>
                <li>Set up alerts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📊 Health Checks & Monitoring</h2>
          <p>Monitor your deployment health and performance:</p>
          
          <div className="monitoring-grid">
            <div className="monitoring-card">
              <h3>Health Check Endpoints</h3>
              <div className="code-block">
                <pre><code>{`# Basic health check
GET /api/price
# Returns: 200 OK with price data

# Detailed health check
GET /api/health
# Returns: 200 OK with system status

# Stellar connection check
GET /api/health/stellar
# Returns: 200 OK if Stellar Horizon is accessible`}</code></pre>
              </div>
            </div>
            
            <div className="monitoring-card">
              <h3>Monitoring Setup</h3>
              <div className="code-block">
                <pre><code>{`# Uptime monitoring
curl -f https://api.codytoken.com/api/price || exit 1

# Response time monitoring
curl -w "@curl-format.txt" -o /dev/null -s https://api.codytoken.com/api/price

# Error rate monitoring
curl -s https://api.codytoken.com/api/price | jq '.error'`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔄 CI/CD Pipeline</h2>
          <p>Set up automated deployment pipeline:</p>
          
          <div className="pipeline-grid">
            <div className="pipeline-card">
              <h3>GitHub Actions</h3>
              <div className="code-block">
                <pre><code>{`name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master
        with:
          version: latest
          
      - name: Deploy
        run: fly deploy
        env:
          FLY_API_TOKEN: \$\{\{ secrets.FLY_API_TOKEN \}\}`}</code></pre>
              </div>
            </div>
            
            <div className="pipeline-card">
              <h3>Docker Registry</h3>
              <div className="code-block">
                <pre><code>{`# Build and push to registry
docker build -t your-registry/codytoken-api:latest .
docker push your-registry/codytoken-api:latest

# Deploy from registry
docker pull your-registry/codytoken-api:latest
docker stop codytoken-api || true
docker rm codytoken-api || true
docker run -d --name codytoken-api \\
  -p 3000:3000 \\
  --restart unless-stopped \\
  your-registry/codytoken-api:latest`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📚 Additional Resources</h2>
          
          <div className="resources-grid">
            <div className="resource-card">
              <h3>Fly.io Documentation</h3>
              <p>Official Fly.io deployment guides</p>
              <a href="https://fly.io/docs/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Fly.io Docs →
              </a>
            </div>
            
            <div className="resource-card">
              <h3>Next.js Deployment</h3>
              <p>Next.js production deployment guide</p>
              <a href="https://nextjs.org/docs/deployment" target="_blank" rel="noopener noreferrer" className="resource-link">
                Next.js Docs →
              </a>
            </div>
            
            <div className="resource-card">
              <h3>Docker Documentation</h3>
              <p>Docker containerization best practices</p>
              <a href="https://docs.docker.com/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Docker Docs →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
