# Cody Token Web3

A modern web application for the CODY token on the Stellar network, featuring real-time price data from multiple sources including Aqua AMM pools, Soroban contracts, and traditional DEX data.

## Features

- **Real-time CODY Price Data**: Fetches price from multiple sources including:
  - Aqua AMM pools (CODY/USDC, CODY/XLM, CODY/AQUA)
  - Soroban smart contracts for reserve data
  - Traditional Stellar DEX (orderbook, VWAP)
  - Comprehensive fallback mechanisms for reliability

- **Multiple Price Sources**:
  - CODY/USDC pool for USD pricing
  - CODY/XLM pool for XLM pricing  
  - CODY/AQUA pool for additional liquidity
  - Soroban contract reserves for accurate pricing
  - Traditional DEX orderbook data

- **Security & Monitoring**:
  - Sentry error monitoring and performance tracking
  - Security vulnerability disclosure via `.well-known/security.txt`
  - Comprehensive security policy and acknowledgments

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
    },
    "soroban": {
      "reserves": {
        "xlm": 0,
        "cody": 0,
        "usdc": 0,
        "eurc": 0
      },
      "prices": {
        "codyPerXlm": 0,
        "xlmPerCody": 0,
        "codyPerUsdc": 0,
        "usdcPerCody": 0,
        "codyPerEurc": 0,
        "eurcPerCody": 0
      },
      "contractId": "CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C"
    },
    "oracle": {
      "price": 0,
      "confidence": 0
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
1. **Aquarius AMM API**: Primary source for pool data (`https://amm-api.aqua.network/api/external/v1`)
2. **Soroban RPC**: Direct contract interaction for reserve data (`https://soroban-rpc.mainnet.stellar.org`)
3. **Stellar Horizon**: Traditional DEX data and liquidity pools (`https://horizon.stellar.org`)
4. **Multi-layered fallback**: Ensures data availability even when sources are down

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
CODY_TOKEN_CONTRACT=CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C
USDC_TOKEN_CONTRACT=CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75
AQUA_TOKEN_CONTRACT=CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK

# Aqua Pool Contract IDs
AQUA_POOL_CONTRACT=CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU
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

The price service uses a multi-layered approach with comprehensive fallback mechanisms:

1. **Primary**: Aqua AMM pools (most accurate for current market conditions)
2. **Secondary**: Soroban smart contract reserves (direct blockchain data)
3. **Tertiary**: Traditional DEX data (orderbook, VWAP)
4. **Fallback**: Cached data with reduced confidence

### Key Components

- **PriceService**: Orchestrates data from all sources and provides aggregated pricing
- **AquaService**: Interfaces with Aqua AMM pools and API
- **SorobanService**: Direct interaction with Soroban smart contracts
- **StellarService**: Traditional Stellar DEX integration
- **Security**: Sentry monitoring, vulnerability disclosure, and comprehensive error handling

This ensures reliable price data even when some sources are unavailable, with proper error monitoring and security practices.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.
