# Cody Token Web3

A modern web application for the CODY token on the Stellar network, featuring real-time price data directly from Horizon's market data with 100% confidence.

## Features

- **Live CODY Price Data**: Fetches real-time prices directly from Stellar's Horizon API:
  - CODY/XLM orderbook data from Stellar DEX
  - Best bid/ask prices with live spreads
  - 24-hour trading volume
  - Automatic USD/EUR conversion using live XLM rates

- **Simplified & Reliable**:
  - Direct Horizon orderbook integration (no complex aggregation)
  - Fallback to recent trades if orderbook is empty
  - Live XLM/USD and XLM/EUR rates from CoinGecko
  - 5-second caching for optimal performance

- **Security & Monitoring**:
  - Sentry error monitoring and performance tracking
  - Security vulnerability disclosure via `.well-known/security.txt`
  - Comprehensive security policy and acknowledgments

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
- **Real-time data**: Direct from Stellar Horizon orderbook
- **Live conversion**: USD/EUR prices calculated using live XLM rates
- **Market depth**: Best bid/ask prices with spread information
- **Trading volume**: 24-hour volume from Stellar DEX
- **Fast caching**: 5-second cache for optimal performance

## Data Sources

The application uses a simplified, reliable approach to price data:

### Primary Data Source
- **Stellar Horizon API**: Direct orderbook and trades data from Stellar DEX
- **CODY/XLM pair**: Primary trading pair for price discovery
- **Live XLM rates**: Real-time USD/EUR conversion using CoinGecko API

### Fallback Strategy
1. **Primary**: CODY/XLM orderbook (best bid/ask mid-price)
2. **Secondary**: Recent trades if orderbook is empty
3. **Conversion**: Live XLM/USD and XLM/EUR rates for accurate pricing

## Environment Variables

```env
# Stellar Configuration
STELLAR_HORIZON_URL=https://horizon.stellar.org
STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015

# CODY Token Configuration
CODY_ISSUER=GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK
CODY_ASSET_CODE=CODY

# CORS Configuration
CORS_ALLOW_ORIGIN=*
NEXT_PUBLIC_SITE_URL=https://codytoken.com
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
```

## Architecture

The price service uses a simplified, reliable approach with direct Horizon integration:

1. **Primary**: Stellar Horizon orderbook (CODY/XLM pair)
2. **Secondary**: Recent trades if orderbook is empty
3. **Conversion**: Live XLM/USD and XLM/EUR rates from CoinGecko
4. **Caching**: 5-second cache for optimal performance

### Key Components

- **PriceService**: Fetches live data from Horizon and provides clean pricing
- **StellarService**: Direct Horizon API integration for orderbook and trades
- **Cache**: In-memory caching for performance optimization
- **Security**: Sentry monitoring, vulnerability disclosure, and comprehensive error handling

This ensures reliable, real-time price data with 100% confidence using only official Stellar market data.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.
