# CODY Token Website

![CODY Token Logo](https://www.codycordova.com/uploads/9/7/2/8/97282376/cody-token-logo_orig.png)

This is the official website and documentation for the $CODY Token — a digital currency on the Stellar Blockchain created by Tech House artist **Cody Cordova**.

The website is a modern, responsive single-page application built with **Next.js** and showcases information about the token, its utilities, price history, and developer tools.

---

## ✨ Features

- 🎨 **3D Token Visualization**
- 🧠 **Dynamic Text & Animations**
- 💸 **Stellar Wallet Connectivity**
- 📈 **Live Token Price via Real-time API**
- 🎮 **Gateway to Web3 Apps & Games**
- 📱 **Responsive UI for all devices**

---

## 🌟 CODY Token Overview

- **Total Supply:** 444,444,444,444 (fixed)
- **Blockchain:** Stellar Network
- **Anchor Asset:** none
- **Issuer Address:** `GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK`
- **Use Cases:** Buy merch, show tickets, join games, redeem rewards, and support Cody directly

---

## 🚀 Getting Started (For Developers)

### 🧰 Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 🛠 Installation

```bash
git clone https://github.com/codycordova/codytoken.git
cd codytoken
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to view it.

### 🔧 Development

```bash
# Start Next.js development server
npm run dev

# Test the API
npm run test:api
```

### 🎵 Educational Mission

I am a music producer/DJ and I am utilizing the capabilities of Stellar's blockchain with tokenizing digital assets to help teach others in a fun and informative interactive way. If you are considering issuing a token you can use components from my code that work to help out with your project. We all build together!

### 🚀 Production Deployment

⚠️ **IMPORTANT**: This is the official CODY Token website. If you want to deploy your own version for learning purposes:

1. **Change the project name** in `package.json` to avoid confusion
2. **Use a different domain/subdomain** (not codytoken-related)
3. **Add clear disclaimers** that it's not the official CODY Token site
4. **Consider using different API endpoints** to avoid rate limiting
5. **Set up your own environment variables** for production

#### For Learning/Development Only:

```bash
# Build and start with PM2
npm run build
pm2 start ecosystem.config.js

# Or use Docker
docker build -t your-project-name .
docker run -p 3000:3000 your-project-name
```

#### Required Environment Variables for Production:

```bash
# Required for production
export CODY_ISSUER="GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK"
export STELLAR_HORIZON_URL="https://horizon.stellar.org"

# Optional: Use your own API keys to avoid rate limits
export COINGECKO_API_KEY="your_api_key_here"
```

**Note**: If you're building your own token project, consider using your own API keys and endpoints to avoid conflicts with the official CODY Token infrastructure.

---

## 🔗 Blockchain & Asset Links

- [Stellar Expert](https://stellar.expert/explorer/public/asset/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEDE5UKQDJAK-1)
- [LumenScan](https://lumenscan.io/assets/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEDE5UKQDJAK)
- [StellarChain](https://stellarchain.io/assets/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEDE5UKQDJAK)

---

## 🛒 How to Buy CODY Token

- [Lobstr](https://lobstr.co/trade/CODY:GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEDE5UKQDJAK)
- [StellarX](https://www.stellarx.com/swap/native/CODY:GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEDE5UKQDJAK)
- [StellarTerm](https://stellarterm.com/swap/XLM-native/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEDE5UKQDJAK)
- [Lumenswap](https://obm.lumenswap.io/swap/XLM/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEDE5UKQDJAK)
- [Scopuly](https://scopuly.com/trade/CODY-XLM/GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEDE5UKQDJAK/native)

---

## 🎯 Project Goals

### Short-Term:
- ✅ Update [CODYTOKEN.com](https://codytoken.com)
- ✅ Add Freighter Wallet support
- ✅ **Real-time price API with accurate market data**
- 🔧 **Build full swap functionality** between XLM ⇄ CODY using Stellar SDK + AMM liquidity pools

### Medium-Term:
- 📱 Build a dedicated CODY Token Wallet
- 🏦 Enable SEP-10 and fiat integrations
- 🔄 **WebSocket real-time price streaming**

### Long-Term:
- 🎮 Launch a Game where players earn CODY
- 🛍 Enable token-based rewards and redemptions

---

## 🧠 Tech Stack

- **[Next.js](https://nextjs.org/)** – Frontend Framework
- **[React](https://reactjs.org/)** – UI Library
- **[TypeScript](https://www.typescriptlang.org/)** – Strong Typing
- **[Three.js / @react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)** – 3D Visuals
- **[Stellar SDK](https://www.stellar.org/developers/)** – Blockchain Integration
- **[CSS Modules](https://github.com/css-modules/css-modules)** – Styling
- **[PM2](https://pm2.keymetrics.io/)** – Process Management

---

## 🔌 Real-time Price API

The CODY Token includes a robust real-time price API that fetches live market data from the Stellar DEX and provides accurate pricing in multiple currencies.

### 📡 REST API Endpoints

#### GET `/api/price`
Returns comprehensive CODY price data including XLM, USD, and EUR prices with real-time market data.

**Response:**
```json
{
  "symbol": "CODY",
  "issuer": "GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK",
  "price": {
    "XLM": 5.5,
    "USD": 2.1465125,
    "EUR": 2.4878073283145365
  },
  "sources": {
    "dex": {
      "bid": 5,
      "ask": 6,
      "spread": 1,
      "volume24h": 1.5709933999999999
    }
  },
  "metadata": {
    "confidence": 0.98,
    "lastUpdate": "2025-08-03T13:01:27.538Z",
    "cacheAge": 0
  }
}
```

### 🏗 API Architecture

- **Data Sources**: Stellar DEX orderbook, recent trades, real-time XLM price from CoinGecko
- **Caching**: 5-second TTL with fallback mechanisms
- **Error Resilience**: Graceful degradation with cached data
- **Multi-currency**: Real-time USD and EUR conversion rates
- **Market Data**: Live bid/ask prices and 24h trading volume

### 🔄 API Features

- **Real-time XLM Price**: Fetched from CoinGecko API
- **Accurate EUR Conversion**: Real EUR/USD exchange rates
- **Market Confidence**: Based on data availability and freshness
- **CORS Enabled**: Cross-origin requests supported
- **Cache Headers**: Optimized for performance

---

## 📁 Deployment

This project is deployed on [Fly.io](https://fly.io/).  
To deploy your own version:

```bash
fly deploy
```

---

## 👤 About Cody Cordova

Cody Cordova is a Tech House artist, DJ, and creative technologist from Los Angeles. With over 14 years in the industry and a love for blockchain, he's bridging tech, music, and community.

- [Spotify](https://open.spotify.com/artist/677lOpgqlsN820JS4ER4ds)
- [Apple Music](https://music.apple.com/us/artist/cody-cordova/1536505416)
- [Instagram](https://www.instagram.com/realcodycordova)
- [YouTube](https://www.youtube.com/@realcodycordova)
- [Twitter/X](https://twitter.com/realcodycordova)

---

## 📜 License

MIT License – I love learning, and I hope maybe you can learn from this as well. 🤝
