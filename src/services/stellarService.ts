import { Horizon, Asset } from '@stellar/stellar-sdk';
import { OrderbookData, LiquidityPoolData, TradeData } from '../types/price';

const HORIZON_URL = process.env.STELLAR_HORIZON_URL || 'https://horizon.stellar.org';
const CODY_ISSUER = process.env.CODY_ISSUER || 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK';
const CODY_ASSET_CODE = process.env.CODY_ASSET_CODE || 'CODY';

const server = new Horizon.Server(HORIZON_URL);
const codyAsset = new Asset(CODY_ASSET_CODE, CODY_ISSUER);
const xlmAsset = Asset.native();

export class StellarService {
  /**
   * Fetch orderbook for CODY/XLM pair
   */
  static async getOrderbook(): Promise<OrderbookData> {
    try {
      const orderbook = await server.orderbook(codyAsset, xlmAsset).call();
      
      const bids = orderbook.bids.map(bid => [
        Number(bid.price_r.n) / Number(bid.price_r.d),
        parseFloat(bid.amount)
      ] as [number, number]);
      
      const asks = orderbook.asks.map(ask => [
        Number(ask.price_r.n) / Number(ask.price_r.d),
        parseFloat(ask.amount)
      ] as [number, number]);

      const bestBid = bids[0]?.[0] || 0;
      const bestAsk = asks[0]?.[0] || 0;
      const spread = bestAsk - bestBid;

      return {
        bids,
        asks,
        spread,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching orderbook:', error);
      throw new Error('Failed to fetch orderbook');
    }
  }

  /**
   * Fetch recent trades for CODY/XLM pair
   */
  static async getRecentTrades(limit: number = 100): Promise<TradeData[]> {
    try {
      const trades = await server.trades()
        .forAssetPair(codyAsset, xlmAsset)
        .limit(limit)
        .order('desc')
        .call();

      return trades.records.map(trade => ({
        price:
          typeof trade.price === 'string'
            ? parseFloat(trade.price)
            : trade.price && typeof trade.price === 'object'
              ? Number(trade.price.n) / Number(trade.price.d)
              : 0,
        amount: parseFloat(trade.base_amount),
        timestamp: trade.ledger_close_time,
        side: trade.base_is_seller ? 'sell' : 'buy'
      }));
    } catch (error) {
      console.error('Error fetching recent trades:', error);
      throw new Error('Failed to fetch recent trades');
    }
  }

  /**
   * Calculate VWAP from recent trades
   */
  static async getVWAP(limit: number = 100): Promise<number> {
    try {
      const trades = await this.getRecentTrades(limit);
      
      if (trades.length === 0) return 0;

      const totalVolume = trades.reduce((sum, trade) => sum + trade.amount, 0);
      const weightedSum = trades.reduce((sum, trade) => sum + (trade.price * trade.amount), 0);
      
      return totalVolume > 0 ? weightedSum / totalVolume : 0;
    } catch (error) {
      console.error('Error calculating VWAP:', error);
      return 0;
    }
  }

  /**
   * Calculate 24h volume
   */
  static async get24hVolume(): Promise<number> {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const trades = await server.trades()
        .forAssetPair(codyAsset, xlmAsset)
        .limit(200)
        .order('desc')
        .call();

      const recentTrades = trades.records.filter(trade => 
        new Date(trade.ledger_close_time) > oneDayAgo
      );

      return recentTrades.reduce((sum, trade) => sum + parseFloat(trade.base_amount), 0);
    } catch (error) {
      console.error('Error calculating 24h volume:', error);
      return 0;
    }
  }

  /**
   * Fetch liquidity pool data (placeholder for future implementation)
   */
  static async getLiquidityPoolData(): Promise<LiquidityPoolData | null> {
    try {
      // This is a placeholder - in a real implementation, you would:
      // 1. Find the liquidity pool for CODY/XLM
      // 2. Fetch the pool's reserves
      // 3. Calculate the implied price from reserves
      
      // For now, return null to indicate no pool data available
      return null;
    } catch (error) {
      console.error('Error fetching liquidity pool data:', error);
      return null;
    }
  }

  /**
   * Get XLM price in USD (placeholder - would need external API)
   */
  static async getXLMPriceUSD(): Promise<number> {
    try {
      // Fetch real XLM price from CoinGecko API
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd');
      const data = await response.json();
      
      if (data && data.stellar && data.stellar.usd) {
        return data.stellar.usd;
      }
      
      // Fallback to a more realistic placeholder if API fails
      return 0.37; // More realistic XLM/USD price
    } catch (error) {
      console.error('Error fetching XLM price:', error);
      return 0.37; // More realistic fallback value
    }
  }

  /**
   * Get XLM price in EUR (placeholder - would need external API)
   */
  static async getXLMPriceEUR(): Promise<number> {
    try {
      const usdPrice = await this.getXLMPriceUSD();
      
      // Fetch real EUR/USD rate from CoinGecko API
      const response = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
      const data = await response.json();
      
      let eurUsdRate = 0.85; // Default fallback
      if (data && data.rates && data.rates.eur && data.rates.usd) {
        // CoinGecko returns how many units equal 1 BTC
        // To get EUR/USD rate: USD_value / EUR_value
        const usdValue = data.rates.usd.value;
        const eurValue = data.rates.eur.value;
        eurUsdRate = usdValue / eurValue;
      }
      
      return usdPrice * eurUsdRate;
    } catch (error) {
      console.error('Error fetching XLM EUR price:', error);
      return 0.31; // More realistic fallback value (0.37 * 0.85)
    }
  }
} 