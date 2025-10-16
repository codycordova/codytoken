import Link from 'next/link';
import '@/styles/Docs.css';

export default function AquaPage() {
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
            <li><Link href="/docs/aqua" className="active">Aqua AMM Integration</Link></li>
            <li><Link href="/docs/deployment">Deployment</Link></li>
          </ul>
        </nav>
      </div>
      
      <div className="docs-content">
        <div className="docs-header">
          <h1>Aqua AMM Integration</h1>
          <p className="docs-subtitle">
            Complete guide to integrating with Aqua AMM pools, accessing liquidity data, 
            and leveraging automated market maker functionality.
          </p>
        </div>

        <div className="docs-section">
          <h2>🏊 Aqua AMM Overview</h2>
          <p>
            Aqua AMM (Automated Market Maker) provides liquidity pools for CODY Token trading 
            with automated price discovery and low slippage. CODY is available in multiple 
            pools for different trading pairs.
          </p>
          
          <div className="pool-overview-grid">
            <div className="pool-overview-card">
              <h3>CODY/USDC Pool</h3>
              <p className="pool-id">CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU</p>
              <p>Primary USD trading pair with high liquidity</p>
            </div>
            
            <div className="pool-overview-card">
              <h3>CODY/XLM Pool</h3>
              <p className="pool-id">CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW</p>
              <p>Native Stellar trading pair</p>
            </div>
            
            <div className="pool-overview-card">
              <h3>CODY/AQUA Pool</h3>
              <p className="pool-id">CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR</p>
              <p>Aqua ecosystem trading pair</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📊 Pool Data API</h2>
          <p>Access real-time Aqua AMM pool data through our API:</p>
          
          <div className="api-endpoint">
            <h3>GET /api/aqua-pools</h3>
            <p>Returns comprehensive data for all CODY pools including TVL, volume, APY, and reserves.</p>
            
            <h4>Response Example:</h4>
            <div className="code-block">
              <pre><code>{`{
  "pools": {
    "codyUsdc": {
      "poolId": "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU",
      "pair": "CODY/USDC",
      "tvl": 3360,
      "volume24h": 32.89,
      "baseAPY": 0.21,
      "rewardsAPY": 0,
      "fee": 0.1,
      "price": 0.001,
      "reserves": {
        "cody": 1000000,
        "counter": 1000
      },
      "timestamp": "2025-08-31T04:20:59.356Z"
    },
    "codyXlm": {...},
    "codyAqua": {...}
  },
  "aggregatedPrice": {
    "XLM": 0.001,
    "USD": 0.001,
    "EUR": 0.00085
  },
  "confidence": 0.9,
  "lastUpdate": "2025-08-31T04:20:59.356Z"
}`}</code></pre>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>💰 Liquidity Provision</h2>
          <p>How to provide liquidity to CODY pools and earn fees:</p>
          
          <div className="liquidity-grid">
            <div className="liquidity-card">
              <h3>1. Pool Selection</h3>
              <p>Choose the pool that best fits your trading strategy:</p>
              <ul>
                <li><strong>CODY/USDC:</strong> Stable USD pairing</li>
                <li><strong>CODY/XLM:</strong> Native Stellar pairing</li>
                <li><strong>CODY/AQUA:</strong> Aqua ecosystem pairing</li>
              </ul>
            </div>
            
            <div className="liquidity-card">
              <h3>2. Equal Value Provision</h3>
              <p>Provide equal values of both assets to the pool:</p>
              <div className="code-block">
                <pre><code>{`// Example: Provide 1000 CODY + 1 USDC to CODY/USDC pool
const poolId = "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU";
const codyAmount = "1000.0000000";
const usdcAmount = "1.0000000";`}</code></pre>
              </div>
            </div>
            
            <div className="liquidity-card">
              <h3>3. Fee Earning</h3>
              <p>Earn fees from trading activity in the pool:</p>
              <ul>
                <li>0.1% fee on all trades</li>
                <li>Fees distributed proportionally to LP tokens</li>
                <li>Real-time APY calculations</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔄 Trading Operations</h2>
          <p>Execute trades through Aqua AMM pools:</p>
          
          <div className="trading-grid">
            <div className="trading-card">
              <h3>Swap CODY for USDC</h3>
              <div className="code-block">
                <pre><code>{`// Using Aqua SDK
import { AquaSDK } from '@aqua/sdk';

const aqua = new AquaSDK();
const poolId = "CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU";

// Get quote
const quote = await aqua.getSwapQuote({
  poolId,
  inputAsset: 'CODY',
  outputAsset: 'USDC',
  amount: '100.0000000'
});

// Execute swap
const swapTx = await aqua.swap({
  poolId,
  inputAsset: 'CODY',
  outputAsset: 'USDC',
  amount: '100.0000000',
  minOutput: quote.minOutput
});`}</code></pre>
              </div>
            </div>
            
            <div className="trading-card">
              <h3>Price Impact Calculation</h3>
              <div className="code-block">
                <pre><code>{`// Calculate price impact for large trades
const priceImpact = (quote.priceImpact * 100).toFixed(2);
console.log(\`Price impact: \$\${priceImpact}%\`);

// Check if impact is acceptable
if (priceImpact > 5) {
  console.warn('High price impact detected');
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📈 Analytics & Monitoring</h2>
          <p>Monitor pool performance and trading activity:</p>
          
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>TVL Tracking</h3>
              <p>Monitor Total Value Locked across all pools</p>
              <div className="code-block">
                <pre><code>{`// Get TVL data
const poolData = await fetch('https://api.codytoken.com/api/aqua-pools')
  .then(r => r.json());

const totalTVL = Object.values(poolData.pools)
  .reduce((sum, pool) => sum + pool.tvl, 0);

console.log(\`Total TVL: \$\$\${totalTVL}\`);`}</code></pre>
              </div>
            </div>
            
            <div className="analytics-card">
              <h3>Volume Analysis</h3>
              <p>Track 24-hour trading volume</p>
              <div className="code-block">
                <pre><code>{`// Calculate total volume
const totalVolume = Object.values(poolData.pools)
  .reduce((sum, pool) => sum + pool.volume24h, 0);

console.log(\`24h Volume: \$\$\${totalVolume}\`);`}</code></pre>
              </div>
            </div>
            
            <div className="analytics-card">
              <h3>APY Monitoring</h3>
              <p>Track yield opportunities across pools</p>
              <div className="code-block">
                <pre><code>{`// Find best APY
const bestPool = Object.values(poolData.pools)
  .sort((a, b) => b.baseAPY - a.baseAPY)[0];

console.log(\`Best APY: \$\${bestPool.baseAPY}% in \$\${bestPool.pair}\`);`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔧 Integration Examples</h2>
          
          <div className="integration-grid">
            <div className="integration-card">
              <h3>Portfolio Tracker</h3>
              <p>Track CODY holdings across different pools</p>
              <div className="code-block">
                <pre><code>{`async function getCodyPortfolio(userAddress) {
  const poolData = await fetch('https://api.codytoken.com/api/aqua-pools')
    .then(r => r.json());
  
  // Get user's LP positions
  const positions = await getUserLPPositions(userAddress);
  
  // Calculate total value
  let totalValue = 0;
  positions.forEach(position => {
    const pool = poolData.pools[position.poolId];
    totalValue += position.lpTokens * pool.tvl / pool.totalLPTokens;
  });
  
  return { positions, totalValue };
}`}</code></pre>
              </div>
            </div>
            
            <div className="integration-card">
              <h3>Arbitrage Bot</h3>
              <p>Identify arbitrage opportunities between pools</p>
              <div className="code-block">
                <pre><code>{`async function findArbitrageOpportunities() {
  const poolData = await fetch('https://api.codytoken.com/api/aqua-pools')
    .then(r => r.json());
  
  const prices = Object.values(poolData.pools).map(pool => ({
    pair: pool.pair,
    price: pool.price,
    poolId: pool.poolId
  }));
  
  // Find price differences
  const opportunities = [];
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      const diff = Math.abs(prices[i].price - prices[j].price);
      if (diff > 0.01) { // 1% difference
        opportunities.push({
          buy: prices[i].price < prices[j].price ? prices[i] : prices[j],
          sell: prices[i].price > prices[j].price ? prices[i] : prices[j],
          profit: diff
        });
      }
    }
  }
  
  return opportunities;
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📚 Additional Resources</h2>
          
          <div className="resources-grid">
            <div className="resource-card">
              <h3>Aqua Documentation</h3>
              <p>Official Aqua AMM documentation and guides</p>
              <a href="https://docs.aqua.network/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Aqua Docs →
              </a>
            </div>
            
            <div className="resource-card">
              <h3>Aqua SDK</h3>
              <p>JavaScript SDK for Aqua AMM integration</p>
              <a href="https://github.com/aqua-network/aqua-sdk" target="_blank" rel="noopener noreferrer" className="resource-link">
                Aqua SDK →
              </a>
            </div>
            
            <div className="resource-card">
              <h3>Pool Explorer</h3>
              <p>Explore CODY pools on Aqua network</p>
              <a href="https://app.aqua.network/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Aqua App →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
