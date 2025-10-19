import Link from 'next/link';
import '@/styles/Docs.css';

export default function ApiReferencePage() {
  return (
    <div className="docs-container">
      <div className="docs-sidebar">
        <div className="docs-logo">
          <h2>CODY Token Docs</h2>
        </div>
        <nav className="docs-nav">
          <ul>
            <li><Link href="/docs">Welcome</Link></li>
            <li><Link href="/docs/api-reference" className="active">API Reference</Link></li>
            <li><Link href="/docs/tokenomics">Tokenomics</Link></li>
            <li><Link href="/docs/integration">Integration Guide</Link></li>
            <li><Link href="/docs/stellar">Stellar Integration</Link></li>
            <li><Link href="/docs/aqua">Aqua AMM Integration</Link></li>
            <li><Link href="/docs/deployment">Deployment</Link></li>
          </ul>
        </nav>
      </div>
      
      <div className="docs-content">
        <div className="docs-header">
          <h1>API Reference</h1>
          <p className="docs-subtitle">
            Complete documentation for all CODY Token API endpoints. All endpoints support CORS 
            and return JSON responses with proper error handling.
          </p>
        </div>

        <div className="docs-section">
          <h2>🔗 Base URL</h2>
          <div className="code-block">
            <pre><code>https://api.codytoken.com</code></pre>
          </div>
        </div>

        <div className="docs-section">
          <h2>📊 Price Data</h2>
          <div className="api-endpoint">
            <h3>GET /api/price</h3>
            <p>Returns live CODY price data directly from Stellar Horizon orderbook with real-time USD/EUR conversion.</p>
            
            <h4>Response Example:</h4>
            <div className="code-block">
              <pre><code>{`{
  "price": {
    "USD": 1.248536,
    "XLM": 4.0,
    "EUR": 1.455417814590192
  },
  "bid": 3,
  "ask": 5,
  "spread": 2,
  "volume24h": 0.2528956,
  "lastUpdate": "2025-10-19T06:13:48.552Z"
}`}</code></pre>
            </div>
            
            <h4>Response Fields:</h4>
            <ul>
              <li><strong>price</strong> - Current prices in USD, XLM, EUR</li>
              <li><strong>bid</strong> - Best bid price from orderbook</li>
              <li><strong>ask</strong> - Best ask price from orderbook</li>
              <li><strong>spread</strong> - Bid-ask spread</li>
              <li><strong>volume24h</strong> - 24-hour trading volume</li>
              <li><strong>lastUpdate</strong> - Timestamp of last price update</li>
            </ul>
          </div>
        </div>

        <div className="docs-section">
          <h2>🏊 Aqua AMM Pools</h2>
          <div className="api-endpoint">
            <h3>GET /api/aqua-pools</h3>
            <p>Returns data specifically from Aqua AMM pools including TVL, volume, and APY information.</p>
            
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
          <h2>💰 Tokenomics</h2>
          <div className="api-endpoint">
            <h3>GET /api/tokenomics</h3>
            <p>Returns current token supply and distribution information.</p>
            
            <h4>Response Example:</h4>
            <div className="code-block">
              <pre><code>{`{
  "totalSupply": 444444444444,
  "circulatingSupply": 2000,
  "source": "stellar_expert",
  "timestamp": "2025-01-15T10:30:00.000Z"
}`}</code></pre>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>💳 Account Balances</h2>
          <div className="api-endpoint">
            <h3>GET /api/balances?account=ACCOUNT_ADDRESS</h3>
            <p>Returns CODY token balance for a specific Stellar account.</p>
            
            <h4>Parameters:</h4>
            <ul>
              <li><strong>account</strong> (required) - Stellar account address</li>
            </ul>
            
            <h4>Response Example:</h4>
            <div className="code-block">
              <pre><code>{`{
  "account": "GBQVKVFXHM3SLYLSIFUNDI2VALQPGOEHLDJ3Z3OLHXS4PK4GN2FSLKLY",
  "balances": [
    {
      "asset_type": "credit_alphanum4",
      "asset_code": "CODY",
      "asset_issuer": "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK",
      "balance": "1000.0000000"
    }
  ],
  "timestamp": "2025-01-15T10:30:00.000Z"
}`}</code></pre>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔐 Stellar SEP Endpoints</h2>
          
          <div className="api-endpoint">
            <h3>GET /api/sep10</h3>
            <p>Stellar Web Authentication endpoint for wallet integration.</p>
          </div>
          
          <div className="api-endpoint">
            <h3>GET /api/sep12</h3>
            <p>KYC/AML compliance endpoint for regulated transfers.</p>
          </div>
          
          <div className="api-endpoint">
            <h3>GET /api/sep24</h3>
            <p>Transfer server endpoint for wallet deposit/withdrawal operations.</p>
          </div>
        </div>

        <div className="docs-section">
          <h2>📄 Stellar TOML</h2>
          <div className="api-endpoint">
            <h3>GET /api/stellar-toml</h3>
            <p>Returns the official Stellar TOML configuration for CODY Token.</p>
            
            <h4>Response:</h4>
            <div className="code-block">
              <pre><code>{`VERSION = "2.7.0"
NETWORK_PASSPHRASE = "Public Global Stellar Network ; September 2015"

# Dedicated signing key for domain/SEP-10
SIGNING_KEY = "GBSP6Z42G7KWTKK2SK7CCGTNZOUC4N5OI3JJAJ35ML7DMPAVG3BRM2ZK"

ACCOUNTS = [
  "GBSP6Z42G7KWTKK2SK7CCGTNZOUC4N5OI3JJAJ35ML7DMPAVG3BRM2ZK",
  "GBQVKVFXHM3SLYLSIFUNDI2VALQPGOEHLDJ3Z3OLHXS4PK4GN2FSLKLY",
  "GAQSBA75ZAJT4NY6JIL7XIBRT6VVVHXDFQ3NLHS5GKTLCKLOVAGLVYQ5",
  "GCNBBQLCRN7AHIQ72LRQU24UZNS5ZCIL7HUXPBA326UUMTRHT55OA5ET",
  "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK"
]

TRANSFER_SERVER = "https://api.codytoken.com/sep24"
WEB_AUTH_ENDPOINT = "https://api.codytoken.com/sep10"
KYC_SERVER = "https://api.codytoken.com/sep12"

[[CURRENCIES]]
code = "CODY"
issuer = "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK"
name = "CODY Token"
display_decimals = 2
desc = "The official utility token for multimedia artist Cody Cordova"
conditions = "Total supply capped at 444,444,444,444 CODY. Only 2,000 tokens are currently in circulation."
image = "https://bafybeih3g2v7m5gziwfp6hr3vwwdjczdy2ql3gloz3jlemdyjgyl7epxcy.ipfs.dweb.link?filename=CC%20LOGO.png.png"
fixed_number = 444444444444
is_asset_anchored = false
status = "live"`}</code></pre>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>⚡ Rate Limits & Caching</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Rate Limits</h3>
              <ul>
                <li><strong>Price API:</strong> 100 requests/minute</li>
                <li><strong>Aqua Pools:</strong> 60 requests/minute</li>
                <li><strong>Tokenomics:</strong> 30 requests/minute</li>
                <li><strong>Balances:</strong> 200 requests/minute</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>Cache Headers</h3>
              <ul>
                <li><strong>Price Data:</strong> 5 seconds</li>
                <li><strong>Pool Data:</strong> 10 seconds</li>
                <li><strong>Tokenomics:</strong> 30 seconds</li>
                <li><strong>Balances:</strong> 15 seconds</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🚨 Error Handling</h2>
          <p>All endpoints return consistent error responses with appropriate HTTP status codes:</p>
          
          <div className="code-block">
            <pre><code>{`{
  "error": "Failed to fetch price data",
  "message": "Rate limit exceeded",
  "timestamp": "2025-01-15T10:30:00.000Z"
}`}</code></pre>
          </div>
          
          <h4>Common HTTP Status Codes:</h4>
          <ul>
            <li><strong>200</strong> - Success</li>
            <li><strong>400</strong> - Bad Request (missing parameters)</li>
            <li><strong>429</strong> - Rate Limit Exceeded</li>
            <li><strong>500</strong> - Internal Server Error</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
