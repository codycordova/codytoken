# Cody Token Web3

A comprehensive web application for the CODY token on the Stellar network, featuring real-time price data, atomic XLM↔CODY swaps, wallet integration, and full Stellar Ecosystem Protocol (SEP) compliance.

## Features

### 🔄 Atomic Swap (XLM ↔ CODY)
- **Direct DEX Swapping**: Swap XLM for CODY tokens directly on the Stellar DEX
- **Real-time Quotes**: Live swap quotes with automatic pathfinding through Stellar's liquidity pools
- **Slippage Protection**: Configurable slippage tolerance (0.5%, 1%, 2%, 3%)
- **Price Impact Calculation**: Real-time price impact estimation before swapping
- **Multi-Signature Support**: Full support for multi-sig wallets
- **Automatic Trustline Management**: Automatically creates CODY trustline if needed
- **Transaction Status**: Real-time transaction status and success notifications

### 💰 Live Price Data & Analytics
- **Real-time CODY Prices**: Fetches live prices directly from Stellar's Horizon API:
  - CODY/XLM orderbook data from Stellar DEX
  - Best bid/ask prices with live spreads
  - 24-hour trading volume
  - Automatic USD/EUR conversion using live XLM rates
- **Aqua AMM Integration**: Live data from Aqua liquidity pools
- **Market Analytics**: Comprehensive market insights and tokenomics data

### 🔐 Wallet Integration
- **Multi-Wallet Support**: Connect with Freighter, xBull, Lobstr, and other Stellar wallets
- **Balance Viewing**: Real-time XLM and CODY balance display
- **Trustline Management**: Easy one-click trustline creation for CODY token
- **Transaction History**: View all wallet transactions and balances
- **Wallet Dropdown**: Quick access to balances, swaps, and wallet management

### 📊 Tokenomics & Supply Tracking
- **Live Circulating Supply**: Real-time tracking of circulating CODY tokens
- **Supply Analytics**: Total supply, circulating supply, and distribution tracking
- **Release Timeline**: Transparent token release and distribution information

### 🌐 Stellar Ecosystem Protocol (SEP) Compliance
- **SEP-10 (Web Authentication)**: Secure wallet authentication for web applications
- **SEP-12 (KYC/AML)**: Know Your Customer and Anti-Money Laundering compliance endpoints
- **SEP-24 (Transfer Server)**: Deposit and withdrawal operations for wallet integration
- **Stellar TOML**: Full Stellar.toml configuration for ecosystem integration

### 📚 Documentation & Education
- **Comprehensive Docs**: Complete API reference, integration guides, and Stellar documentation
- **Educational Blog**: Guides on Stellar wallets, security, DEX trading, and more
- **Developer Resources**: Full API documentation with examples

### 🛡️ Security & Monitoring
- **Sentry Integration**: Comprehensive error monitoring and performance tracking
- **Security Policy**: Vulnerability disclosure via `.well-known/security.txt`
- **Transaction Validation**: Full transaction validation before submission
- **Multi-Sig Detection**: Automatic detection and handling of multi-signature accounts

## Core Functionality

### Swap Interface (`/purchase`)
- **Atomic Swap Card**: Full-featured swap interface with:
  - Real-time quote calculation
  - Balance display (XLM and CODY)
  - Slippage configuration
  - Route visualization
  - Price impact warnings
  - Transaction status tracking

### Wallet Management
- **Connect/Disconnect**: Seamless wallet connection and disconnection
- **Balance Refresh**: Automatic balance updates every 10 seconds
- **Trustline Status**: Real-time trustline status checking and creation

### Price & Market Data
- **Live Price API**: Real-time price endpoint with caching
- **Aqua Pools**: Integration with Aqua AMM pools
- **Market Depth**: Orderbook data with bid/ask spreads

## API Endpoints

### `/api/price`
Returns live CODY price data directly from Horizon's market data.

**Response:**
```json
{
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
}
```

**Features:**
- Real-time data from Stellar Horizon orderbook
- Live USD/EUR conversion using CoinGecko rates
- Market depth with bid/ask spreads
- 24-hour trading volume
- 5-second cache for optimal performance

### `/api/balances`
Returns wallet balances for a given Stellar account.

**Query Parameters:**
- `account` (required): Stellar account address (G...)

**Response:**
```json
{
  "account": "G...",
  "balances": [
    {
      "asset_type": "native",
      "balance": "100.0000000"
    },
    {
      "asset_type": "credit_alphanum4",
      "asset_code": "CODY",
      "asset_issuer": "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK",
      "balance": "50.00"
    }
  ]
}
```

### `/api/tokenomics`
Returns live tokenomics data including circulating supply.

**Response:**
```json
{
  "totalSupply": 444444444444,
  "circulatingSupply": 2000,
  "source": "Stellar Horizon",
  "timestamp": "2025-01-20T12:00:00.000Z"
}
```

### `/api/aqua-pools`
Returns Aqua AMM pool data for CODY token pairs.

### `/api/sep10`
SEP-10 Web Authentication endpoint for wallet authentication.

### `/api/sep12`
SEP-12 KYC/AML compliance endpoint.

### `/api/sep24`
SEP-24 Transfer Server endpoint for deposit/withdrawal operations.

### `/api/stellar-toml`
Returns Stellar TOML configuration file for ecosystem integration.

## Pages & Routes

- **`/`** - Homepage with hero, features, stats, and educational content
- **`/purchase`** - Swap interface for XLM ↔ CODY atomic swaps
- **`/balances`** - Wallet balance viewer with all asset balances
- **`/tokenomics`** - Tokenomics dashboard with supply information
- **`/docs`** - Comprehensive documentation hub
- **`/docs/api-reference`** - Full API documentation
- **`/docs/stellar`** - Stellar integration guide
- **`/docs/aqua`** - Aqua AMM integration guide
- **`/docs/integration`** - Integration examples and tutorials
- **`/blog`** - Educational blog posts
- **`/whitepaper`** - Project whitepaper
- **`/contact`** - Contact and support information

## Data Sources

### Primary Data Sources
- **Stellar Horizon API**: Direct orderbook and trades data from Stellar DEX
- **CODY/XLM pair**: Primary trading pair for price discovery
- **Live XLM rates**: Real-time USD/EUR conversion using CoinGecko API
- **Aqua AMM**: Liquidity pool data from Aqua protocol

### Fallback Strategy
1. **Primary**: CODY/XLM orderbook (best bid/ask mid-price)
2. **Secondary**: Recent trades if orderbook is empty
3. **Conversion**: Live XLM/USD and XLM/EUR rates for accurate pricing

## Environment Variables

```env
# Stellar Configuration
STELLAR_HORIZON_URL=https://horizon.stellar.org
STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
NEXT_PUBLIC_STELLAR_NETWORK=public

# CODY Token Configuration
CODY_ISSUER=GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK
CODY_ASSET_CODE=CODY
NEXT_PUBLIC_TOKEN_CODE=CODY
NEXT_PUBLIC_TOKEN_ISSUER=GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK

# SEP-10 Configuration
WEB_AUTH_SIGNING_SECRET=your_secret_key_here
SEP10_DOMAIN=codytoken.com
SEP10_HOME_DOMAIN=codytoken.com

# CORS Configuration
CORS_ALLOW_ORIGIN=*
NEXT_PUBLIC_SITE_URL=https://codytoken.com

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# CI verification (lint + typecheck + stellar validation + build)
npm run ci:verify
```

## Architecture

### Swap Flow
1. **Quote Calculation**: Real-time pathfinding using Stellar's `strictSendPaths`
2. **Transaction Building**: Multi-operation transactions (trustline + swap if needed)
3. **Wallet Signing**: Integration with Stellar Wallets Kit for secure signing
4. **Submission**: Direct submission to Horizon with error handling
5. **Status Updates**: Real-time transaction status and balance refresh

### Price Service
1. **Primary**: Stellar Horizon orderbook (CODY/XLM pair)
2. **Secondary**: Recent trades if orderbook is empty
3. **Conversion**: Live XLM/USD and XLM/EUR rates from CoinGecko
4. **Caching**: 5-second cache for optimal performance

### Key Components

#### Frontend Components
- **`AtomicSwapCard`**: Full-featured swap interface with real-time quotes
- **`WalletConnect`**: Wallet connection and balance display
- **`TrustlineButton`**: One-click trustline management
- **`AddressDisplay`**: Secure address display with copy functionality

#### Services
- **`PriceService`**: Fetches live data from Horizon and provides clean pricing
- **`StellarService`**: Direct Horizon API integration for orderbook and trades
- **`AquaService`**: Aqua AMM pool data integration
- **`TokenomicsService`**: Tokenomics and supply tracking
- **`SEP10Service`**: SEP-10 Web Authentication implementation
- **`JWTService`**: JWT token management for authentication

#### Context Providers
- **`WalletContext`**: Global wallet state management
- **`StellarWalletsContext`**: Stellar Wallets Kit integration

### Security Features
- **Sentry Monitoring**: Comprehensive error tracking and performance monitoring
- **Transaction Validation**: Full validation before submission
- **Multi-Sig Support**: Proper handling of multi-signature accounts
- **Error Boundaries**: React error boundaries for graceful error handling
- **Security Headers**: Proper CORS and security headers

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Blockchain**: Stellar SDK (@stellar/stellar-sdk)
- **Wallet Integration**: @creit-tech/stellar-wallets-kit
- **Monitoring**: Sentry (@sentry/nextjs)
- **Styling**: CSS Modules + Inline Styles
- **Deployment**: Fly.io (configured via fly.toml)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.
