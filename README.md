# Cody Token Web3

A modern web application for the CODY token on the Stellar network, featuring real-time price data from multiple sources including Aqua AMM pools.

## Features

- **Real-time CODY Price Data**: Fetches price from multiple sources including:
  - Traditional Stellar DEX (orderbook, VWAP)
  - Aqua AMM pools (CODY/USDC, CODY/XLM, CODY/AQUA)
  - Fallback mechanisms for reliability

- **Multiple Price Sources**:
  - CODY/USDC pool for USD pricing
  - CODY/XLM pool for XLM pricing  
  - CODY/AQUA pool for additional liquidity
  - Traditional DEX orderbook data

## API Endpoints

### `/api/price`
Returns comprehensive CODY price data from all available sources.

**Response:**
```json
{
  "symbol": "CODY",
  "issuer": "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK",
  "price": {
    "XLM": 4.0,
    "USD": 1.45,
    "EUR": 1.70
  },
  "sources": {
    "dex": {
      "bid": 3,
      "ask": 5,
      "spread": 2,
      "volume24h": 24.91
    },
    "pool": {
      "price": 4.83,
      "reserves": {
        "cody": 52.39,
        "xlm": 252.99
      }
    },
    "aqua": {
      "pools": {
        "codyUsdc": {...},
        "codyXlm": {...},
        "codyAqua": {...}
      },
      "aggregatedPrice": {
        "XLM": 0,
        "USD": 0,
        "EUR": 0
      }
    }
  },
  "metadata": {
    "confidence": 0.6,
    "lastUpdate": "2025-08-31T04:21:06.479Z",
    "cacheAge": 0
  }
}
```

### `/api/aqua-pools`
Returns data specifically from Aqua AMM pools.

**Response:**
```json
{
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
}
```

## Aqua AMM Integration

The application integrates with Aqua AMM pools to provide real-time pricing data:

### Pool Contract IDs
- **CODY/USDC**: `CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU`
- **CODY/XLM**: `CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW`
- **CODY/AQUA**: `CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR`

### Data Sources
1. **Aquarius AMM API**: Primary source for pool data
2. **Soroban RPC**: Fallback for reserve data
3. **Traditional DEX**: Backup for price data

## Environment Variables

```env
# Stellar Configuration
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

The price service uses a multi-layered approach:

1. **Primary**: Aqua AMM pools (most accurate for current market conditions)
2. **Secondary**: Traditional DEX data (orderbook, VWAP)
3. **Fallback**: Cached data with reduced confidence

This ensures reliable price data even when some sources are unavailable.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.
