import { StellarService } from './stellarService';
import { AquaService } from './aquaService';
import { SorobanService } from './sorobanService';
import { cache } from '../utils/cache';
import { PriceData } from '../types/price';
import { config } from '../config/stellarConfig';

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
          cacheAge: Date.now() - new Date(cached.metadata.lastUpdate).getTime(),
        },
      };
    }

    try {
      // Fetch data from multiple sources in parallel
      const [sorobanData, aquaData, orderbook, vwap, volume24h, poolData, xlmUsd, xlmEur] = await Promise.allSettled([
        SorobanService.getCodyPoolReserves(),
        AquaService.getAllCodyPools(),
        StellarService.getOrderbook(),
        StellarService.getVWAP(),
        StellarService.get24hVolume(),
        StellarService.getLiquidityPoolData(),
        StellarService.getXLMPriceUSD(),
        StellarService.getXLMPriceEUR(),
      ]);

      // Extract successful results
      const sorobanPools = sorobanData.status === 'fulfilled' ? sorobanData.value : null;
      const aquaPools = aquaData.status === 'fulfilled' ? aquaData.value : null;
      const orderbookData = orderbook.status === 'fulfilled' ? orderbook.value : null;
      const vwapPrice = vwap.status === 'fulfilled' ? vwap.value : 0;
      const volume = volume24h.status === 'fulfilled' ? volume24h.value : 0;
      const pool = poolData.status === 'fulfilled' ? poolData.value : null;
      const xlmUsdPrice = xlmUsd.status === 'fulfilled' ? xlmUsd.value : 0.12;
      const xlmEurPrice = xlmEur.status === 'fulfilled' ? xlmEur.value : 0.1;

      // Prioritize Soroban contract data as the most accurate source
      let primaryPrice = 0;
      let confidence = 0.3; // Base confidence
      let xlmPrice = 0;
      let eurPrice = 0;

      if (sorobanPools && sorobanPools.prices) {
        // Use Soroban contract prices as primary source
        primaryPrice = sorobanPools.prices.codyPerUsdc; // Direct USD price from USDC pool
        xlmPrice = sorobanPools.prices.codyPerXlm; // Direct XLM price
        eurPrice = sorobanPools.prices.codyPerEurc; // Direct EUR price
        
        // High confidence for Soroban contract data
        confidence += 0.5;
        
        // Add confidence based on pool reserves
        if (sorobanPools.reserves.xlm > 0) confidence += 0.1;
        if (sorobanPools.reserves.usdc > 0) confidence += 0.1;
        if (sorobanPools.reserves.eurc > 0) confidence += 0.1;
        if (sorobanPools.reserves.cody > 0) confidence += 0.1;
      }

      // Fallback to Aqua pools if Soroban data is not available
      if (primaryPrice === 0 && aquaPools) {
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
          primaryPrice = ((bestBid + bestAsk) / 2) * xlmUsdPrice; // Convert XLM to USD
          confidence += 0.3;
        } else if (vwapPrice > 0) {
          primaryPrice = vwapPrice * xlmUsdPrice; // Convert XLM to USD
          confidence += 0.2;
        }
      }

      // Use Soroban prices if available, otherwise calculate from USD price
      if (xlmPrice === 0) {
        xlmPrice = xlmUsdPrice > 0 ? primaryPrice / xlmUsdPrice : 0;
      }
      if (eurPrice === 0) {
        eurPrice = xlmUsdPrice > 0 ? primaryPrice * (xlmEurPrice / xlmUsdPrice) : 0;
      }

      const priceData: PriceData = {
        symbol: 'CODY',
        issuer: config.CODY_ISSUER || 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK',
        price: {
          XLM: xlmPrice,
          USD: primaryPrice,
          EUR: eurPrice,
        },
        sources: {
          dex: {
            bid: orderbookData?.bids[0]?.[0] || 0,
            ask: orderbookData?.asks[0]?.[0] || 0,
            spread: orderbookData?.spread || 0,
            volume24h: volume,
          },
          pool: {
            price: pool?.price || 0,
            reserves: pool?.reserves || { cody: 0, xlm: 0 },
          },
          aqua: {
            pools: aquaPools?.pools || {
              codyUsdc: {
                poolId: '',
                pair: 'CODY/USDC',
                tvl: 0,
                volume24h: 0,
                baseAPY: 0,
                rewardsAPY: 0,
                fee: 0.1,
                price: 0,
                reserves: { cody: 0, counter: 0 },
                timestamp: new Date().toISOString()
              },
              codyXlm: {
                poolId: '',
                pair: 'CODY/XLM',
                tvl: 0,
                volume24h: 0,
                baseAPY: 0,
                rewardsAPY: 0,
                fee: 0.1,
                price: 0,
                reserves: { cody: 0, counter: 0 },
                timestamp: new Date().toISOString()
              },
              codyAqua: {
                poolId: '',
                pair: 'CODY/AQUA',
                tvl: 0,
                volume24h: 0,
                baseAPY: 0,
                rewardsAPY: 0,
                fee: 0.1,
                price: 0,
                reserves: { cody: 0, counter: 0 },
                timestamp: new Date().toISOString()
              }
            },
            aggregatedPrice: aquaPools?.aggregatedPrice || { XLM: 0, USD: 0, EUR: 0 },
          },
          soroban: {
            reserves: sorobanPools?.reserves || { xlm: 0, cody: 0, usdc: 0, eurc: 0 },
            prices: sorobanPools?.prices || {
              codyPerXlm: 0,
              xlmPerCody: 0,
              codyPerUsdc: 0,
              usdcPerCody: 0,
              codyPerEurc: 0,
              eurcPerCody: 0
            },
            contractId: sorobanPools?.contractId || '',
          },
          oracle: {
            price: 0,
            confidence: 0
          }
        },
        metadata: {
          confidence: Math.min(confidence, 0.98),
          lastUpdate: new Date().toISOString(),
          cacheAge: 0,
        },
      };

      // Cache the result
      cache.set(this.CACHE_KEY, priceData, this.CACHE_TTL);

      return priceData;
    } catch (error) {
      console.error('Error fetching CODY price:', error);

      // Return fallback data if available from the cache
      const fallback = cache.get<PriceData>(this.CACHE_KEY);
      if (fallback) {
        return {
          ...fallback,
          metadata: {
            ...fallback.metadata,
            confidence: Math.max(fallback.metadata.confidence * 0.8, 0.3),
            cacheAge: Date.now() - new Date(fallback.metadata.lastUpdate).getTime(),
          },
        };
      }

      // Return minimal fallback data
      return {
        symbol: 'CODY',
        issuer: config.CODY_ISSUER || 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK',
        price: {
          XLM: 0,
          USD: 0,
          EUR: 0,
        },
        sources: {
          dex: {
            bid: 0,
            ask: 0,
            spread: 0,
            volume24h: 0,
          },
        },
        metadata: {
          confidence: 0.1,
          lastUpdate: new Date().toISOString(),
          cacheAge: 0,
        },
      };
    }
  }
}