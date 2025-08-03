import { StellarService } from './stellarService';
import { cache } from '../utils/cache';
import { PriceData } from '../types/price';

export class PriceService {
  private static readonly CACHE_TTL = 5000; // 5 seconds
  private static readonly CACHE_KEY = 'cody_price_data';

  /**
   * Get comprehensive CODY price data from multiple sources
   */
  static async getCodyPrice(): Promise<PriceData> {
    // Check cache first
    const cached = cache.get<PriceData>(this.CACHE_KEY);
    if (cached) {
      return {
        ...cached,
        metadata: {
          ...cached.metadata,
          cacheAge: Date.now() - new Date(cached.metadata.lastUpdate).getTime()
        }
      };
    }

    try {
      // Fetch data from multiple sources in parallel
      const [orderbook, vwap, volume24h, poolData, xlmUsd, xlmEur] = await Promise.allSettled([
        StellarService.getOrderbook(),
        StellarService.getVWAP(),
        StellarService.get24hVolume(),
        StellarService.getLiquidityPoolData(),
        StellarService.getXLMPriceUSD(),
        StellarService.getXLMPriceEUR()
      ]);

      // Extract successful results
      const orderbookData = orderbook.status === 'fulfilled' ? orderbook.value : null;
      const vwapPrice = vwap.status === 'fulfilled' ? vwap.value : 0;
      const volume = volume24h.status === 'fulfilled' ? volume24h.value : 0;
      const pool = poolData.status === 'fulfilled' ? poolData.value : null;
      const xlmUsdPrice = xlmUsd.status === 'fulfilled' ? xlmUsd.value : 0.12;
      const xlmEurPrice = xlmEur.status === 'fulfilled' ? xlmEur.value : 0.10;

      // Calculate primary price (prefer orderbook mid-price, fallback to VWAP)
      let primaryPrice = 0;
      if (orderbookData && orderbookData.bids.length > 0 && orderbookData.asks.length > 0) {
        const bestBid = orderbookData.bids[0][0];
        const bestAsk = orderbookData.asks[0][0];
        primaryPrice = (bestBid + bestAsk) / 2;
      } else if (vwapPrice > 0) {
        primaryPrice = vwapPrice;
      }

      // Calculate confidence based on data availability
      let confidence = 0.5; // Base confidence
      if (orderbookData && orderbookData.bids.length > 0 && orderbookData.asks.length > 0) {
        confidence += 0.3; // Orderbook data available
      }
      if (vwapPrice > 0) {
        confidence += 0.2; // VWAP available
      }
      if (pool) {
        confidence += 0.1; // Pool data available
      }

      const priceData: PriceData = {
        symbol: 'CODY',
        issuer: process.env.CODY_ISSUER || 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK',
        price: {
          XLM: primaryPrice,
          USD: primaryPrice * xlmUsdPrice,
          EUR: primaryPrice * xlmEurPrice
        },
        sources: {
          dex: {
            bid: orderbookData?.bids[0]?.[0] || 0,
            ask: orderbookData?.asks[0]?.[0] || 0,
            spread: orderbookData?.spread || 0,
            volume24h: volume
          },
          pool: pool ? {
            price: pool.price,
            reserves: pool.reserves
          } : undefined,
          oracle: undefined // Placeholder for future oracle integration
        },
        metadata: {
          confidence: Math.min(confidence, 0.98),
          lastUpdate: new Date().toISOString(),
          cacheAge: 0
        }
      };

      // Cache the result
      cache.set(this.CACHE_KEY, priceData, this.CACHE_TTL);

      return priceData;
    } catch (error) {
      console.error('Error fetching CODY price:', error);
      
      // Return fallback data if available from cache
      const fallback = cache.get<PriceData>(this.CACHE_KEY);
      if (fallback) {
        return {
          ...fallback,
          metadata: {
            ...fallback.metadata,
            confidence: Math.max(fallback.metadata.confidence * 0.8, 0.3),
            cacheAge: Date.now() - new Date(fallback.metadata.lastUpdate).getTime()
          }
        };
      }

      // Return minimal fallback data
      return {
        symbol: 'CODY',
        issuer: process.env.CODY_ISSUER || 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK',
        price: {
          XLM: 0,
          USD: 0,
          EUR: 0
        },
        sources: {
          dex: {
            bid: 0,
            ask: 0,
            spread: 0,
            volume24h: 0
          }
        },
        metadata: {
          confidence: 0.1,
          lastUpdate: new Date().toISOString(),
          cacheAge: 0
        }
      };
    }
  }

  /**
   * Get real-time trade data for WebSocket streaming
   */
  static async getLatestTrade() {
    try {
      const trades = await StellarService.getRecentTrades(1);
      return trades[0] || null;
    } catch (error) {
      console.error('Error fetching latest trade:', error);
      return null;
    }
  }

  /**
   * Clear price cache (useful for testing or manual refresh)
   */
  static clearCache(): void {
    cache.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    return {
      size: cache.size(),
      hasPriceData: cache.get(this.CACHE_KEY) !== null
    };
  }
} 