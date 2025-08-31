import { StellarService } from './stellarService';
import { AquaService } from './aquaService';
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
      const [aquaData, orderbook, vwap, volume24h, poolData, xlmUsd, xlmEur] = await Promise.allSettled([
        AquaService.getAllCodyPools(),
        StellarService.getOrderbook(),
        StellarService.getVWAP(),
        StellarService.get24hVolume(),
        StellarService.getLiquidityPoolData(),
        StellarService.getXLMPriceUSD(),
        StellarService.getXLMPriceEUR()
      ]);

      // Extract successful results
      const aquaPools = aquaData.status === 'fulfilled' ? aquaData.value : null;
      const orderbookData = orderbook.status === 'fulfilled' ? orderbook.value : null;
      const vwapPrice = vwap.status === 'fulfilled' ? vwap.value : 0;
      const volume = volume24h.status === 'fulfilled' ? volume24h.value : 0;
      const pool = poolData.status === 'fulfilled' ? poolData.value : null;
      const xlmUsdPrice = xlmUsd.status === 'fulfilled' ? xlmUsd.value : 0.12;
      const xlmEurPrice = xlmEur.status === 'fulfilled' ? xlmEur.value : 0.10;

      // Use Aqua pools as primary price source
      let primaryPrice = 0;
      let confidence = 0.3; // Base confidence

      if (aquaPools) {
        // Prefer CODY/USDC for USD price, CODY/XLM for XLM price
        if (aquaPools.pools.codyUsdc && aquaPools.pools.codyUsdc.price > 0) {
          primaryPrice = aquaPools.pools.codyUsdc.price; // This is USD price
          confidence += 0.4;
        } else if (aquaPools.pools.codyXlm && aquaPools.pools.codyXlm.price > 0) {
          primaryPrice = aquaPools.pools.codyXlm.price * xlmUsdPrice; // Convert XLM to USD
          confidence += 0.3;
        }

        // Add confidence for each available pool
        if (aquaPools.pools.codyXlm) confidence += 0.2;
        if (aquaPools.pools.codyAqua) confidence += 0.1;
      }

      // Fallback to traditional DEX data if Aqua data is not available
      if (primaryPrice === 0) {
        if (orderbookData && orderbookData.bids.length > 0 && orderbookData.asks.length > 0) {
          const bestBid = orderbookData.bids[0][0];
          const bestAsk = orderbookData.asks[0][0];
          primaryPrice = (bestBid + bestAsk) / 2 * xlmUsdPrice; // Convert XLM to USD
          confidence += 0.3;
        } else if (vwapPrice > 0) {
          primaryPrice = vwapPrice * xlmUsdPrice; // Convert XLM to USD
          confidence += 0.2;
        }
      }

      // Calculate XLM and EUR prices
      const xlmPrice = xlmUsdPrice > 0 ? primaryPrice / xlmUsdPrice : 0;
      const eurPrice = primaryPrice * (xlmEurPrice / xlmUsdPrice);

      const priceData: PriceData = {
        symbol: 'CODY',
        issuer: process.env.CODY_ISSUER || 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK',
        price: {
          XLM: xlmPrice,
          USD: primaryPrice,
          EUR: eurPrice
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
          aqua: aquaPools ? {
            pools: aquaPools.pools,
            aggregatedPrice: aquaPools.aggregatedPrice
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
   * Get Aqua pool data specifically
   */
  static async getAquaPoolData() {
    try {
      return await AquaService.getAllCodyPools();
    } catch (error) {
      console.error('Error fetching Aqua pool data:', error);
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