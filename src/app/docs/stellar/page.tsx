import Link from 'next/link';
import '@/styles/Docs.css';
import AddressDisplay from '../../../components/AddressDisplay';

export default function StellarPage() {
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
            <li><Link href="/docs/stellar" className="active">Stellar Integration</Link></li>
            <li><Link href="/docs/aqua">Aqua AMM Integration</Link></li>
            <li><Link href="/docs/deployment">Deployment</Link></li>
          </ul>
        </nav>
      </div>
      
      <div className="docs-content">
        <div className="docs-header">
          <h1>Stellar Integration</h1>
          <p className="docs-subtitle">
            Complete guide to integrating CODY Token with Stellar wallets, 
            SEP compliance, and blockchain operations.
          </p>
        </div>

        <div className="docs-section">
          <h2>🌟 Stellar SEP Compliance</h2>
          <p>
            CODY Token is fully compliant with Stellar Ecosystem Protocol (SEP) standards, 
            enabling seamless integration with Stellar wallets and applications.
          </p>
          
          <div className="sep-grid">
            <div className="sep-card">
              <h3>SEP-10: Web Authentication</h3>
              <p>Secure authentication for web applications</p>
              <div className="code-block">
                <pre><code>{`// Endpoint: https://api.codytoken.com/api/sep10
// Enables wallet authentication for web apps`}</code></pre>
              </div>
            </div>
            
            <div className="sep-card">
              <h3>SEP-12: KYC/AML</h3>
              <p>Know Your Customer and Anti-Money Laundering compliance</p>
              <div className="code-block">
                <pre><code>{`// Endpoint: https://api.codytoken.com/api/sep12
// Handles customer verification and compliance`}</code></pre>
              </div>
            </div>
            
            <div className="sep-card">
              <h3>SEP-24: Transfer Server</h3>
              <p>Deposit and withdrawal operations for wallets</p>
              <div className="code-block">
                <pre><code>{`// Endpoint: https://api.codytoken.com/api/sep24
// Enables wallet deposit/withdrawal functionality`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔗 Stellar TOML Configuration</h2>
          <p>
            Our Stellar TOML file provides all necessary information for wallet integration:
          </p>
          
          <div className="code-block">
            <pre><code>{`VERSION = "2.7.0"
NETWORK_PASSPHRASE = "Public Global Stellar Network ; September 2015"

# Dedicated signing key for domain/SEP-10
SIGNING_KEY = "GBSP6Z42G7KWTKK2SK7CCGTNZOUC4N5OI3JJAJ35ML7DMPAVG3BRM2ZK"

ACCOUNTS = [
  "GBSP6Z42G7KWTKK2SK7CCGTNZOUC4N5OI3JJAJ35ML7DMPAVG3BRM2ZK", # domain/signing
  "GBQVKVFXHM3SLYLSIFUNDI2VALQPGOEHLDJ3Z3OLHXS4PK4GN2FSLKLY", # distribution
  "GAQSBA75ZAJT4NY6JIL7XIBRT6VVVHXDFQ3NLHS5GKTLCKLOVAGLVYQ5", # ops
  "GCNBBQLCRN7AHIQ72LRQU24UZNS5ZCIL7HUXPBA326UUMTRHT55OA5ET", # ops
  "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK"  # CODY issuer
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

        <div className="docs-section">
          <h2>💼 Wallet Integration</h2>
          <p>Integrate CODY Token with popular Stellar wallets:</p>
          
          <div className="wallet-grid">
            <div className="wallet-card">
              <h3>Lobstr Wallet</h3>
              <p>Popular mobile and web wallet for Stellar</p>
              <ul>
                <li>Native CODY support</li>
                <li>SEP-24 transfers</li>
                <li>Trustline management</li>
              </ul>
            </div>
            
            <div className="wallet-card">
              <h3>StellarX</h3>
              <p>Advanced trading platform</p>
              <ul>
                <li>DEX trading</li>
                <li>Portfolio tracking</li>
                <li>Market analysis</li>
              </ul>
            </div>
            
            <div className="wallet-card">
              <h3>Freighter</h3>
              <p>Browser extension wallet</p>
              <ul>
                <li>Web3 integration</li>
                <li>dApp connectivity</li>
                <li>Transaction signing</li>
              </ul>
            </div>
            
            <div className="wallet-card">
              <h3>StellarTerm</h3>
              <p>Web-based wallet interface</p>
              <ul>
                <li>Account management</li>
                <li>Asset operations</li>
                <li>Transaction history</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🔧 Technical Implementation</h2>
          
          <div className="implementation-grid">
            <div className="implementation-card">
              <h3>Trustline Creation</h3>
              <p>How to create a trustline for CODY Token:</p>
              <div className="code-block">
                <pre><code>{`// Using Stellar SDK
import { Server, Asset, Keypair } from 'stellar-sdk';

const server = new Server('https://horizon.stellar.org');
const codyAsset = new Asset('CODY', 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK');

// Create trustline operation
const trustlineOp = Operation.changeTrust({
  asset: codyAsset,
  limit: '1000000' // Optional limit
});

// Build and submit transaction
const transaction = new TransactionBuilder(account, {
  fee: '100',
  networkPassphrase: Networks.PUBLIC
})
  .addOperation(trustlineOp)
  .setTimeout(30)
  .build();`}</code></pre>
              </div>
            </div>
            
            <div className="implementation-card">
              <h3>Balance Queries</h3>
              <p>Query CODY token balances:</p>
              <div className="code-block">
                <pre><code>{`// Using our API
const response = await fetch(
  'https://api.codytoken.com/api/balances?account=ACCOUNT_ADDRESS'
);
const data = await response.json();

// Or using Stellar SDK directly
const account = await server.loadAccount('ACCOUNT_ADDRESS');
const codyBalance = account.balances.find(
  balance => balance.asset_code === 'CODY'
);`}</code></pre>
              </div>
            </div>
            
            <div className="implementation-card">
              <h3>Payment Operations</h3>
              <p>Send CODY tokens between accounts:</p>
              <div className="code-block">
                <pre><code>{`// Create payment operation
const paymentOp = Operation.payment({
  destination: 'DESTINATION_ADDRESS',
  asset: codyAsset,
  amount: '100.0000000' // Amount in stroops
});

// Build transaction
const transaction = new TransactionBuilder(sourceAccount, {
  fee: '100',
  networkPassphrase: Networks.PUBLIC
})
  .addOperation(paymentOp)
  .setTimeout(30)
  .build();`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📊 Account Information</h2>
          
          <div className="account-grid">
            <div className="account-card">
              <h3>CODY Token Issuer</h3>
              <p className="address"><AddressDisplay address="GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" /></p>
              <p>Official issuer account for CODY Token (locked/immutable)</p>
            </div>
            
            <div className="account-card">
              <h3>Distribution Wallet</h3>
              <p className="address">GBQVKVFXHM3SLYLSIFUNDI2VALQPGOEHLDJ3Z3OLHXS4PK4GN2FSLKLY</p>
              <p>Manages circulating supply and token distribution</p>
            </div>
            
            <div className="account-card">
              <h3>Domain Signing Key</h3>
              <p className="address">GBSP6Z42G7KWTKK2SK7CCGTNZOUC4N5OI3JJAJ35ML7DMPAVG3BRM2ZK</p>
              <p>Used for SEP-10 authentication and domain verification</p>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>🛡️ Security Best Practices</h2>
          
          <div className="security-grid">
            <div className="security-card">
              <h3>🔐 Key Management</h3>
              <ul>
                <li>Use hardware wallets for large amounts</li>
                <li>Never share private keys</li>
                <li>Use multi-signature for important accounts</li>
                <li>Regularly rotate signing keys</li>
              </ul>
            </div>
            
            <div className="security-card">
              <h3>✅ Transaction Verification</h3>
              <ul>
                <li>Always verify asset codes and issuers</li>
                <li>Check transaction details before signing</li>
                <li>Use official Stellar tools for verification</li>
                <li>Be cautious of phishing attempts</li>
              </ul>
            </div>
            
            <div className="security-card">
              <h3>🔍 Trustline Management</h3>
              <ul>
                <li>Set appropriate trustline limits</li>
                <li>Regularly review authorized assets</li>
                <li>Remove unused trustlines</li>
                <li>Monitor for unauthorized changes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-section">
          <h2>📚 Additional Resources</h2>
          
          <div className="resources-grid">
            <div className="resource-card">
              <h3>Stellar Documentation</h3>
              <p>Official Stellar development documentation</p>
              <a href="https://developers.stellar.org/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Stellar Dev Docs →
              </a>
            </div>
            
            <div className="resource-card">
              <h3>SEP Standards</h3>
              <p>Stellar Ecosystem Protocol specifications</p>
              <a href="https://github.com/stellar/stellar-protocol/tree/master/ecosystem" target="_blank" rel="noopener noreferrer" className="resource-link">
                SEP Standards →
              </a>
            </div>
            
            <div className="resource-card">
              <h3>Stellar Expert</h3>
              <p>Explore CODY Token on Stellar network</p>
              <a href="https://stellar.expert/explorer/public/asset/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" target="_blank" rel="noopener noreferrer" className="resource-link">
                View on Stellar Expert →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
