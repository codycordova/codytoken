import { StellarService } from './stellarService';
import { cache } from '../utils/cache';
import { PriceData } from '../types/price';

export class PriceService {
  private static readonly CACHE_TTL = 5000; // 5 seconds
  private static readonly CACHE_KEY = 'cody_price_data';

  /**
   * Get live CODY price data from Horizon orderbook and trades
   */
  static async getCodyPrice(): Promise<PriceData> {
    // Check cache first
    const cached = cache.get<PriceData>(this.CACHE_KEY);
    if (cached) {
      return cached;
    }

    try {
      // Fetch data from Horizon in parallel
      const [orderbookData, volume24h, xlmUsdResult, xlmEurResult] = await Promise.allSettled([
        StellarService.getOrderbook(),
        StellarService.get24hVolume(),
        StellarService.getXLMPriceUSD(),
        StellarService.getXLMPriceEUR(),
      ]);

      // Extract successful results
      const orderbook = orderbookData.status === 'fulfilled' ? orderbookData.value : null;
      const volume = volume24h.status === 'fulfilled' ? volume24h.value : 0;
      const xlmUsdPrice = xlmUsdResult.status === 'fulfilled' ? xlmUsdResult.value : 0.12;
      const xlmEurPrice = xlmEurResult.status === 'fulfilled' ? xlmEurResult.value : 0.1;

      let codyXlmPrice = 0;
      let bid = 0;
      let ask = 0;
      let spread = 0;

      // Calculate price from orderbook
      if (orderbook && orderbook.bids.length > 0 && orderbook.asks.length > 0) {
        bid = orderbook.bids[0][0];
        ask = orderbook.asks[0][0];
        codyXlmPrice = (bid + ask) / 2;
        spread = ask - bid;
      } else {
        // Fallback to recent trades if orderbook is empty
        try {
          const trades = await StellarService.getRecentTrades(1);
          if (trades.length > 0) {
            codyXlmPrice = trades[0].price;
            bid = codyXlmPrice;
            ask = codyXlmPrice;
            spread = 0;
          }
        } catch (error) {
          console.error('Error fetching recent trades:', error);
        }
      }

      // Convert XLM price to USD and EUR
      const codyUsdPrice = codyXlmPrice * xlmUsdPrice;
      const codyEurPrice = codyUsdPrice * (xlmEurPrice / xlmUsdPrice);

      const priceData: PriceData = {
        price: {
          USD: codyUsdPrice,
          XLM: codyXlmPrice,
          EUR: codyEurPrice,
        },
        bid,
        ask,
        spread,
        volume24h: volume,
        lastUpdate: new Date().toISOString(),
      };

      // Cache the result
      cache.set(this.CACHE_KEY, priceData, this.CACHE_TTL);

      return priceData;
    } catch (error) {
      console.error('Error fetching CODY price:', error);

      // Return fallback data if available from the cache
      const fallback = cache.get<PriceData>(this.CACHE_KEY);
      if (fallback) {
        return fallback;
      }

      // Return minimal fallback data
      return {
        price: {
          USD: 0,
          XLM: 0,
          EUR: 0,
        },
        bid: 0,
        ask: 0,
        spread: 0,
        volume24h: 0,
        lastUpdate: new Date().toISOString(),
      };
    }
  }
}