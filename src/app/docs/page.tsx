import Link from 'next/link';
import './Docs.css';

export default function DocsPage() {
  return (
    <div className="docs-container">
      <div className="docs-sidebar">
        <div className="docs-logo">
          <h2>CODY Token Docs</h2>
        </div>
        <nav className="docs-nav">
          <ul>
            <li><Link href="/docs" className="active">Welcome</Link></li>
            <li><Link href="/docs/api-reference">API Reference</Link></li>
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
          <h1>CODY Token Developer Documentation</h1>
          <p className="docs-subtitle">
            Build with CODY Token on the Stellar network. Access real-time data, 
            integrate with wallets, and leverage our comprehensive API ecosystem.
          </p>
        </div>

        <div className="docs-section">
          <h2>🚀 Quick Start</h2>
          <p>Get started with CODY Token in minutes:</p>
          <div className="code-block">
            <pre><code>{`// Get real-time CODY price
const response = await fetch('https://api.codytoken.com/api/price');
const priceData = await response.json();
console.log(priceData.price.USD); // Current USD price`}</code></pre>
          </div>
        </div>

        <div className="docs-section">
          <h2>📊 What is CODY Token?</h2>
          <p>
            CODY Token is a Stellar-based utility token by multimedia artist Cody Cordova. 
            It&apos;s designed for merchandise, tickets, gaming rewards, and community interaction 
            with a total supply of 444,444,444,444 tokens.
          </p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <h3>🎵 Merchandise & Tickets</h3>
              <p>Redeem CODY tokens for exclusive merchandise and concert tickets</p>
            </div>
            <div className="feature-card">
              <h3>🎮 Play-to-Earn Gaming</h3>
              <p>Future web-based RPGs and creative mini-games with CODY rewards</p>
            </div>
            <div className="feature-card">
              <h3>📊 Live Analytics</h3>
              <p>Real-time price data from multiple sources including Stellar DEX and Aqua AMM</p>
            </div>
            <div className="feature-card">
              <h3>🖼️ Digital Collectibles</h3>
              <p>Limited-edition NFT drops and digital art pieces</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔗 Key Information</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Token Details</h3>
              <ul>
                <li><strong>Code:</strong> CODY</li>
                <li><strong>Issuer:</strong> GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK</li>
                <li><strong>Total Supply:</strong> 444,444,444,444 CODY</li>
                <li><strong>Circulating:</strong> 2,000 CODY</li>
                <li><strong>Network:</strong> Stellar Mainnet</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>Distribution Wallet</h3>
              <p>
                <a 
                  href="https://stellar.expert/explorer/public/account/GBQVKVFXHM3SLYLSIFUNDI2VALQPGOEHLDJ3Z3OLHXS4PK4GN2FSLKLY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wallet-link"
                >
                  🔍 Verify Distribution Wallet
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📚 Documentation Sections</h2>
          <div className="docs-grid">
            <Link href="/docs/api-reference" className="docs-card">
              <h3>API Reference</h3>
              <p>Complete documentation for all CODY Token API endpoints including price data, tokenomics, and balance queries.</p>
            </Link>
            <Link href="/docs/tokenomics" className="docs-card">
              <h3>Tokenomics</h3>
              <p>Detailed breakdown of CODY Token supply, distribution, and economic model.</p>
            </Link>
            <Link href="/docs/integration" className="docs-card">
              <h3>Integration Guide</h3>
              <p>Step-by-step guide to integrate CODY Token into your applications and websites.</p>
            </Link>
            <Link href="/docs/stellar" className="docs-card">
              <h3>Stellar Integration</h3>
              <p>SEP compliance, wallet integration, and Stellar network best practices.</p>
            </Link>
            <Link href="/docs/aqua" className="docs-card">
              <h3>Aqua AMM Integration</h3>
              <p>Access Aqua AMM pool data, liquidity analytics, and trading information.</p>
            </Link>
            <Link href="/docs/deployment" className="docs-card">
              <h3>Deployment</h3>
              <p>Self-hosting guides, environment setup, and production deployment.</p>
            </Link>
          </div>
        </div>

        <div className="docs-section">
          <h2>🛠️ Developer Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <h3>GitHub Repository</h3>
              <p>View the source code and contribute to the project</p>
              <a href="https://github.com/codycordova/codytoken" target="_blank" rel="noopener noreferrer" className="resource-link">
                View on GitHub →
              </a>
            </div>
            <div className="resource-card">
              <h3>Stellar Expert</h3>
              <p>Explore CODY Token on the Stellar network</p>
              <a href="https://stellar.expert/explorer/public/asset/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" target="_blank" rel="noopener noreferrer" className="resource-link">
                View on Stellar Expert →
              </a>
            </div>
            <div className="resource-card">
              <h3>Support</h3>
              <p>Get help with integration and development</p>
              <a href="/contact" className="resource-link">
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
