import Link from 'next/link';
import '@/styles/Docs.css';

export default function IntegrationPage() {
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
            <li><Link href="/docs/integration" className="active">Integration Guide</Link></li>
            <li><Link href="/docs/stellar">Stellar Integration</Link></li>
            <li><Link href="/docs/aqua">Aqua AMM Integration</Link></li>
            <li><Link href="/docs/deployment">Deployment</Link></li>
          </ul>
        </nav>
      </div>
      
      <div className="docs-content">
        <div className="docs-header">
          <h1>Integration Guide</h1>
          <p className="docs-subtitle">
            Step-by-step guide to integrate CODY Token into your applications, 
            websites, and services.
          </p>
        </div>

        <div className="docs-section">
          <h2>🚀 Quick Start</h2>
          <p>Get CODY Token price data in your application in under 5 minutes:</p>
          
          <div className="code-block">
            <pre><code>{`// JavaScript/TypeScript
async function getCodyPrice() {
  try {
    const response = await fetch('https://api.codytoken.com/api/price');
    const data = await response.json();
    
    console.log('CODY Price:', data.price.USD);
    console.log('XLM Price:', data.price.XLM);
    
    return data;
  } catch (error) {
    console.error('Failed to fetch CODY price:', error);
  }
}

// Call the function
getCodyPrice();`}</code></pre>
          </div>
        </div>

        <div className="docs-section">
          <h2>💻 Language Examples</h2>
          
          <div className="language-tabs">
            <div className="language-tab active">JavaScript</div>
            <div className="language-tab">Python</div>
            <div className="language-tab">PHP</div>
            <div className="language-tab">cURL</div>
          </div>
          
          <div className="code-block">
            <pre><code>{`// JavaScript/Node.js
const axios = require('axios');

async function getCodyData() {
  try {
    const response = await axios.get('https://api.codytoken.com/api/price');
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}`}</code></pre>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔧 Common Integration Patterns</h2>
          
          <div className="integration-grid">
            <div className="integration-card">
              <h3>💰 Price Display Widget</h3>
              <p>Display real-time CODY price on your website</p>
              <div className="code-block">
                <pre><code>{`// HTML
<div id="cody-price">Loading...</div>

// JavaScript
fetch('https://api.codytoken.com/api/price')
  .then(response => response.json())
  .then(data => {
    document.getElementById('cody-price').innerHTML = 
      \`\$\${data.price.USD.toFixed(4)}\`;
  });`}</code></pre>
              </div>
            </div>
            
            <div className="integration-card">
              <h3>📊 Portfolio Tracker</h3>
              <p>Track CODY holdings and portfolio value</p>
              <div className="code-block">
                <pre><code>{`async function getPortfolioValue(codyAmount) {
  const priceData = await fetch('https://api.codytoken.com/api/price')
    .then(r => r.json());
  
  const usdValue = codyAmount * priceData.price.USD;
  const xlmValue = codyAmount * priceData.price.XLM;
  
  return { usdValue, xlmValue };
}`}</code></pre>
              </div>
            </div>
            
            <div className="integration-card">
              <h3>🔄 Auto-Refresh Price</h3>
              <p>Keep price data updated automatically</p>
              <div className="code-block">
                <pre><code>{`// Update price every 30 seconds
setInterval(async () => {
  try {
    const response = await fetch('https://api.codytoken.com/api/price');
    const data = await response.json();
    updatePriceDisplay(data.price.USD);
  } catch (error) {
    console.error('Price update failed:', error);
  }
}, 30000);`}</code></pre>
              </div>
            </div>
            
            <div className="integration-card">
              <h3>📈 Price Chart Integration</h3>
              <p>Integrate with charting libraries</p>
              <div className="code-block">
                <pre><code>{`// Chart.js example
async function createCodyChart() {
  const priceData = await fetch('https://api.codytoken.com/api/price')
    .then(r => r.json());
  
  const ctx = document.getElementById('codyChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['CODY/USD'],
      datasets: [{
        label: 'CODY Price',
        data: [priceData.price.USD],
        borderColor: '#ffea00'
      }]
    }
  });
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🎯 Use Cases</h2>
          
          <div className="usecase-grid">
            <div className="usecase-card">
              <div className="usecase-icon">💼</div>
              <h3>Business Applications</h3>
              <ul>
                <li>Payment processing systems</li>
                <li>Point-of-sale integration</li>
                <li>Accounting software</li>
                <li>Financial reporting tools</li>
              </ul>
            </div>
            
            <div className="usecase-card">
              <div className="usecase-icon">🎮</div>
              <h3>Gaming Platforms</h3>
              <ul>
                <li>In-game currency systems</li>
                <li>Reward distribution</li>
                <li>Marketplace integration</li>
                <li>Player portfolio tracking</li>
              </ul>
            </div>
            
            <div className="usecase-card">
              <div className="usecase-icon">🛒</div>
              <h3>E-commerce</h3>
              <ul>
                <li>Product pricing in CODY</li>
                <li>Checkout integration</li>
                <li>Loyalty programs</li>
                <li>Discount calculations</li>
              </ul>
            </div>
            
            <div className="usecase-card">
              <div className="usecase-icon">📱</div>
              <h3>Mobile Apps</h3>
              <ul>
                <li>Price alerts and notifications</li>
                <li>Portfolio management</li>
                <li>Trading interfaces</li>
                <li>Market data widgets</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>⚡ Performance Optimization</h2>
          
          <div className="optimization-grid">
            <div className="optimization-card">
              <h3>🔄 Caching Strategy</h3>
              <p>Our APIs include cache headers to optimize performance:</p>
              <ul>
                <li><strong>Price Data:</strong> 5-second cache</li>
                <li><strong>Pool Data:</strong> 10-second cache</li>
                <li><strong>Tokenomics:</strong> 30-second cache</li>
              </ul>
            </div>
            
            <div className="optimization-card">
              <h3>📊 Rate Limiting</h3>
              <p>Respect rate limits for optimal performance:</p>
              <ul>
                <li><strong>Price API:</strong> 100 req/min</li>
                <li><strong>Aqua Pools:</strong> 60 req/min</li>
                <li><strong>Tokenomics:</strong> 30 req/min</li>
              </ul>
            </div>
            
            <div className="optimization-card">
              <h3>🛡️ Error Handling</h3>
              <p>Implement robust error handling:</p>
              <div className="code-block">
                <pre><code>{`async function getCodyPriceWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('https://api.codytoken.com/api/price');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔒 Security Best Practices</h2>
          
          <div className="security-grid">
            <div className="security-card">
              <h3>🌐 CORS Configuration</h3>
              <p>All our APIs support CORS for cross-origin requests. No additional configuration needed for web applications.</p>
            </div>
            
            <div className="security-card">
              <h3>🔐 API Keys</h3>
              <p>Currently, no API keys are required. All endpoints are publicly accessible with rate limiting protection.</p>
            </div>
            
            <div className="security-card">
              <h3>🛡️ Input Validation</h3>
              <p>Always validate user inputs and sanitize data before making API calls:</p>
              <div className="code-block">
                <pre><code>{`function validateStellarAddress(address) {
  const stellarAddressRegex = /^G[A-Z0-9]{55}$/;
  return stellarAddressRegex.test(address);
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📚 Additional Resources</h2>
          
          <div className="resources-grid">
            <div className="resource-card">
              <h3>Stellar Documentation</h3>
              <p>Learn about the Stellar network and blockchain fundamentals</p>
              <a href="https://developers.stellar.org/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Stellar Dev Docs →
              </a>
            </div>
            
            <div className="resource-card">
              <h3>Aqua AMM Guide</h3>
              <p>Understand Aqua AMM pools and liquidity provision</p>
              <a href="https://docs.aqua.network/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Aqua Documentation →
              </a>
            </div>
            
            <div className="resource-card">
              <h3>Community Support</h3>
              <p>Get help from the CODY Token community</p>
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
