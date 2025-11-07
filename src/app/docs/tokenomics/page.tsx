"use client";
import Link from 'next/link';
import '@/styles/Docs.css';
import AddressDisplay from '../../../components/AddressDisplay';

export default function TokenomicsPage() {

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
            <li><Link href="/docs/tokenomics" className="active">Tokenomics</Link></li>
            <li><Link href="/docs/integration">Integration Guide</Link></li>
            <li><Link href="/docs/stellar">Stellar Integration</Link></li>
            <li><Link href="/docs/aqua">Aqua AMM Integration</Link></li>
            <li><Link href="/docs/deployment">Deployment</Link></li>
          </ul>
        </nav>
      </div>
      
      <div className="docs-content">
        <div className="docs-header">
          <h1>Tokenomics</h1>
          <p className="docs-subtitle">
            Comprehensive breakdown of CODY Token&apos;s economic model, supply distribution, 
            and utility mechanisms.
          </p>
        </div>

        <div className="docs-section">
          <h2>📊 Supply Overview</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Total Supply</h3>
              <p className="large-number">444,444,444,444</p>
              <p>CODY tokens (fixed, immutable)</p>
            </div>
            <div className="info-card">
              <h3>Circulating Supply</h3>
              <p className="large-number">2,000</p>
              <p>CODY tokens (0.00000045% of total)</p>
            </div>
            <div className="info-card">
              <h3>Active Trustlines</h3>
              <p className="large-number">60+</p>
              <p>Stellar accounts holding CODY</p>
            </div>
            <div className="info-card">
              <h3>Total Trades</h3>
              <p className="large-number">42,000+</p>
              <p>Transactions on Stellar DEX</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🏦 Distribution Strategy</h2>
          <p>
            CODY Token follows a gradual release strategy to study market behavior and maintain 
            fair liquidity. The circulating supply is intentionally limited to create scarcity 
            while allowing for controlled growth.
          </p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <h3>🎯 Controlled Release</h3>
              <p>Only 2,000 tokens are currently in circulation, representing less than 0.00000045% of the total supply. This creates natural scarcity and allows for careful market observation.</p>
            </div>
            <div className="feature-card">
              <h3>📈 Market Study</h3>
              <p>The limited circulation allows us to study market behavior, price discovery, and community adoption patterns before larger releases.</p>
            </div>
            <div className="feature-card">
              <h3>⚖️ Fair Liquidity</h3>
              <p>Gradual release ensures fair access to tokens and prevents market manipulation or sudden price volatility.</p>
            </div>
            <div className="feature-card">
              <h3>🔒 Immutable Supply</h3>
              <p>The total supply of 444,444,444,444 CODY tokens is fixed and cannot be changed, ensuring predictable tokenomics.</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>💎 Token Utility</h2>
          <p>CODY Token serves multiple utility functions within the Cody Cordova ecosystem:</p>
          
          <div className="utility-grid">
            <div className="utility-card">
              <div className="utility-icon">🎵</div>
              <h3>Merchandise & Tickets</h3>
              <p>Redeem CODY tokens for exclusive Cody Cordova merchandise, concert tickets, and special event access.</p>
            </div>
            <div className="utility-card">
              <div className="utility-icon">🎮</div>
              <h3>Play-to-Earn Gaming</h3>
              <p>Future web-based RPGs and creative mini-games where players can earn CODY tokens through gameplay and creativity.</p>
            </div>
            <div className="utility-card">
              <div className="utility-icon">🖼️</div>
              <h3>Digital Collectibles</h3>
              <p>Limited-edition NFT drops and digital art pieces that can be purchased and traded using CODY tokens.</p>
            </div>
            <div className="utility-card">
              <div className="utility-icon">🏆</div>
              <h3>Community Rewards</h3>
              <p>Rewards for community participation, content creation, and engagement within the Cody Cordova ecosystem.</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔗 Technical Specifications</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Blockchain</h3>
              <ul>
                <li><strong>Network:</strong> Stellar Mainnet</li>
                <li><strong>Asset Code:</strong> CODY</li>
                <li><strong>Issuer:</strong> <AddressDisplay address="GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" /></li>
                <li><strong>Decimals:</strong> 7 (Stellar standard)</li>
                <li><strong>Display Decimals:</strong> 2</li>
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
              <p>All circulating tokens are managed through this verified distribution wallet.</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📈 Market Data</h2>
          <p>Real-time market data is available through our API endpoints:</p>
          
          <div className="code-block">
            <pre><code>{`// Get current tokenomics data
const response = await fetch('https://api.codytoken.com/api/tokenomics');
const data = await response.json();

console.log(data.totalSupply);      // 444444444444
console.log(data.circulatingSupply); // 2000
console.log(data.source);           // "stellar_expert"`}</code></pre>
          </div>
        </div>

        <div className="docs-section">
          <h2>🏊 Liquidity Pools</h2>
          <p>CODY Token is available in multiple Aqua AMM pools for trading and liquidity provision:</p>
          
          <div className="pool-grid">
            <div className="pool-card">
              <h3>CODY/USDC</h3>
              <p>Pool ID: CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU</p>
              <p>Primary USD trading pair</p>
            </div>
            <div className="pool-card">
              <h3>CODY/XLM</h3>
              <p>Pool ID: CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW</p>
              <p>Native Stellar trading pair</p>
            </div>
            <div className="pool-card">
              <h3>CODY/AQUA</h3>
              <p>Pool ID: CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR</p>
              <p>Aqua ecosystem trading pair</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔮 Future Roadmap</h2>
          <div className="roadmap-grid">
            <div className="roadmap-item">
              <div className="roadmap-phase">Phase 1</div>
              <h3>Current State</h3>
              <ul>
                <li>2,000 tokens in circulation</li>
                <li>Basic utility functions</li>
                <li>Stellar DEX trading</li>
                <li>Aqua AMM integration</li>
              </ul>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-phase">Phase 2</div>
              <h3>Expanded Utility</h3>
              <ul>
                <li>Merchandise redemption</li>
                <li>Concert ticket access</li>
                <li>Community rewards program</li>
                <li>NFT marketplace integration</li>
              </ul>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-phase">Phase 3</div>
              <h3>Gaming Ecosystem</h3>
              <ul>
                <li>Play-to-earn games</li>
                <li>Creative mini-games</li>
                <li>Gaming rewards system</li>
                <li>Cross-platform integration</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📋 Compliance & Legal</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Regulatory Status</h3>
              <ul>
                <li>Utility token (not a security)</li>
                <li>Stellar network compliance</li>
                <li>SEP-10/12/24 compliant</li>
                <li>KYC/AML ready</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>Transparency</h3>
              <ul>
                <li>Public blockchain records</li>
                <li>Verifiable distribution wallet</li>
                <li>Open source codebase</li>
                <li>Regular market updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
