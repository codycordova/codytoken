import { Horizon, Asset } from '@stellar/stellar-sdk';
import { tryPoolReservesFromSoroban, getTokenDecimals } from './sorobanService';
import { OrderbookData, LiquidityPoolData, TradeData } from '@/types/price';
import { config } from '@/config/stellarConfig';
import { fetchWithTimeout } from '@/utils/net';
import { cache } from '@/utils/cache';
import { logger } from '@/utils/logger';

const HORIZON_URL = config.HORIZON_URL;
const DEFAULT_CODY_ISSUER = 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK';
const CODY_ISSUER = config.CODY_ISSUER || DEFAULT_CODY_ISSUER;
const CODY_ASSET_CODE = config.CODY_ASSET_CODE || 'CODY';

const server = new Horizon.Server(HORIZON_URL);
const codyAsset = new Asset(CODY_ASSET_CODE, CODY_ISSUER);
const xlmAsset = Asset.native();

// Minimal Horizon response types used in this service to avoid `any`
type HorizonOrderbookRow = {
  price?: string | number;
  price_r?: { n: string | number; d: string | number };
  amount?: string | number;
};
type HorizonOrderbookResponse = {
  bids: HorizonOrderbookRow[];
  asks: HorizonOrderbookRow[];
};

type HorizonTradeRecord = {
  price: string | { n: string | number; d: string | number };
  base_amount: string;
  ledger_close_time: string;
  base_is_seller: boolean;
};
type HorizonTradesResponse = {
  records: HorizonTradeRecord[];
};

type HorizonLiquidityPoolReserve = { asset: string; amount: string };
type HorizonLiquidityPoolRecord = { reserves: HorizonLiquidityPoolReserve[] };
type HorizonLiquidityPoolsResponse = { records: HorizonLiquidityPoolRecord[] };

export class StellarService {
  /**
   * Fetch orderbook for CODY/XLM pair
   */
  static async getOrderbook(): Promise<OrderbookData> {
    try {
      const orderbook = (await server.orderbook(codyAsset, xlmAsset).call()) as HorizonOrderbookResponse;

      const bids = (Array.isArray(orderbook.bids) ? orderbook.bids : [])
        .map((bid: HorizonOrderbookRow) => {
          const price =
            bid?.price_r && Number(bid.price_r.d) !== 0
              ? Number(bid.price_r.n) / Number(bid.price_r.d)
              : Number(bid?.price ?? 0);
          const amount = parseFloat(String(bid?.amount ?? '0'));
          return [Number.isFinite(price) ? price : 0, Number.isFinite(amount) ? amount : 0] as [number, number];
        })
        .filter(([p, a]) => p > 0 && a > 0);

      const asks = (Array.isArray(orderbook.asks) ? orderbook.asks : [])
        .map((ask: HorizonOrderbookRow) => {
          const price =
            ask?.price_r && Number(ask.price_r.d) !== 0
              ? Number(ask.price_r.n) / Number(ask.price_r.d)
              : Number(ask?.price ?? 0);
          const amount = parseFloat(String(ask?.amount ?? '0'));
          return [Number.isFinite(price) ? price : 0, Number.isFinite(amount) ? amount : 0] as [number, number];
        })
        .filter(([p, a]) => p > 0 && a > 0);

      const bestBid = bids[0]?.[0] || 0;
      const bestAsk = asks[0]?.[0] || 0;
      const spread = bestAsk > 0 && bestBid > 0 ? Math.max(bestAsk - bestBid, 0) : 0;

      return {
        bids,
        asks,
        spread,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error fetching orderbook:', error);
      throw new Error('Failed to fetch orderbook');
    }
  }

  /**
   * Fetch recent trades for CODY/XLM pair
   */
  static async getRecentTrades(limit: number = 100): Promise<TradeData[]> {
    try {
      const trades = (await server
        .trades()
        .forAssetPair(codyAsset, xlmAsset)
        .limit(Math.max(1, Math.min(limit, 200)))
        .order('desc')
        .call()) as HorizonTradesResponse;

      return trades.records.map((trade: HorizonTradeRecord) => ({
        price:
          typeof trade.price === 'string'
            ? parseFloat(trade.price)
            : trade.price && typeof trade.price === 'object'
            ? Number((trade.price as { n: string | number; d: string | number }).n) /
              Number((trade.price as { n: string | number; d: string | number }).d)
            : 0,
        amount: parseFloat(trade.base_amount),
        timestamp: trade.ledger_close_time,
        side: trade.base_is_seller ? 'sell' : 'buy',
      }));
    } catch (error) {
      logger.error('Error fetching recent trades:', error);
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

      const totalVolume = trades.reduce((sum, trade) => sum + (Number.isFinite(trade.amount) ? trade.amount : 0), 0);
      const weightedSum = trades.reduce(
        (sum, trade) => sum + (Number.isFinite(trade.price) ? trade.price : 0) * (Number.isFinite(trade.amount) ? trade.amount : 0),
        0
      );

      return totalVolume > 0 ? weightedSum / totalVolume : 0;
    } catch (error) {
      logger.error('Error calculating VWAP:', error);
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

      const trades = (await server
        .trades()
        .forAssetPair(codyAsset, xlmAsset)
        .limit(200)
        .order('desc')
        .call()) as HorizonTradesResponse;

      const recentTrades = trades.records.filter(
        (trade: HorizonTradeRecord) => new Date(trade.ledger_close_time) > oneDayAgo
      );

      return recentTrades.reduce((sum: number, trade: HorizonTradeRecord) => sum + parseFloat(trade.base_amount), 0);
    } catch (error) {
      logger.error('Error calculating 24h volume:', error);
      return 0;
    }
  }

  /**
   * Fetch liquidity pool data
   */
  static async getLiquidityPoolData(): Promise<LiquidityPoolData | null> {
    try {
      // First, try Soroban pool if configured
      const sorobanPoolId = config.AQUA_POOL_CONTRACT;
      const codyContractId = config.CODY_TOKEN_CONTRACT;

      if (sorobanPoolId) {
        const reserves = await tryPoolReservesFromSoroban(sorobanPoolId, codyContractId);
        if (reserves) {
          // Fetch decimals to scale raw amounts
          const codyDecimals = codyContractId ? await getTokenDecimals(codyContractId) : 2;
          const counterDecimals = config.USDC_TOKEN_CONTRACT ? await getTokenDecimals(config.USDC_TOKEN_CONTRACT) : 6;
          const codyScale = Math.pow(10, codyDecimals ?? 2);
          const counterScale = Math.pow(10, counterDecimals ?? 6);

          const codyAmount = reserves.codyRaw / codyScale;
          const counterAmount = reserves.counterRaw / counterScale;
          const price = codyAmount > 0 ? counterAmount / codyAmount : 0;

          return {
            reserves: {
              cody: codyAmount,
              xlm: 0,
            },
            price,
            timestamp: new Date().toISOString(),
          };
        }
      }

      // Fallback to classic Horizon AMM (for CODY/XLM or CODY/USDC if exists as a classic pool)
      const usdcIssuer = config.USDC_ISSUER || 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';

      // Validate USDC issuer format
      if (!usdcIssuer || usdcIssuer.length !== 56 || !usdcIssuer.startsWith('G')) {
        logger.warn('Invalid USDC issuer format, skipping USDC pool lookup');
        // Try XLM pool directly
        const pool = (await server.liquidityPools().forAssets(codyAsset, xlmAsset).limit(1).call()) as HorizonLiquidityPoolsResponse;
        if (!pool || !pool.records || pool.records.length === 0) return null;

        const record = pool.records[0];
        const reserves = record.reserves;
        const reserveCody = reserves.find(
          (r: HorizonLiquidityPoolReserve) =>
            r.asset.includes(`${CODY_ASSET_CODE}:${CODY_ISSUER}`)
        );
        const reserveXlm = reserves.find((r: HorizonLiquidityPoolReserve) => r.asset === 'native');
        if (!reserveCody || !reserveXlm) return null;

        const codyAmount = parseFloat(reserveCody.amount);
        const xlmAmount = parseFloat(reserveXlm.amount);
        const price = xlmAmount > 0 && codyAmount > 0 ? xlmAmount / codyAmount : 0;

        return {
          reserves: { cody: codyAmount, xlm: xlmAmount },
          price,
          timestamp: new Date().toISOString(),
        };
      }

      const usdcAsset = new Asset('USDC', usdcIssuer);
      let pool: HorizonLiquidityPoolsResponse | null;
      try {
        pool = (await server.liquidityPools().forAssets(codyAsset, usdcAsset).limit(1).call()) as HorizonLiquidityPoolsResponse;
      } catch {
        pool = null;
      }
      if (!pool || !pool.records || pool.records.length === 0) {
        pool = (await server.liquidityPools().forAssets(codyAsset, xlmAsset).limit(1).call()) as HorizonLiquidityPoolsResponse;
      }
      if (!pool || !pool.records || pool.records.length === 0) return null;

      const record = pool.records[0];
      const reserves = record.reserves;
      const reserveCody = reserves.find(
        (r: HorizonLiquidityPoolReserve) =>
            r.asset.includes(`${CODY_ASSET_CODE}:${CODY_ISSUER}`)
      );
      const reserveOther = reserves.find((r: HorizonLiquidityPoolReserve) => !reserveCody || r !== reserveCody);
      if (!reserveCody || !reserveOther) return null;
      const codyAmount = parseFloat(reserveCody.amount);
      const otherAmount = parseFloat(reserveOther.amount);
      const price = otherAmount > 0 && codyAmount > 0 ? otherAmount / codyAmount : 0;
      return {
        reserves: { cody: codyAmount, xlm: reserveOther.asset === 'native' ? otherAmount : 0 },
        price,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error fetching liquidity pool data:', error);
      return null;
    }
  }

  /**
   * Get XLM price in USD
   */
  static async getXLMPriceUSD(): Promise<number> {
    const CACHE_KEY = 'coingecko_xlm_usd';
    const cached = cache.get<number>(CACHE_KEY);
    if (cached !== null) return cached;

    try {
      const response = await fetchWithTimeout(
        'https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd',
        undefined,
        8000
      );
      const data = await response.json();

      if (data && data.stellar && typeof data.stellar.usd === 'number' && data.stellar.usd > 0) {
        cache.set(CACHE_KEY, data.stellar.usd, 60_000);
        return data.stellar.usd;
      }

      return 0.37;
    } catch (error) {
      logger.error('Error fetching XLM price (USD):', error);
      return 0.37; // Fallback value
    }
  }

  /**
   * Get XLM price in EUR
   */
  static async getXLMPriceEUR(): Promise<number> {
    const usdPrice = await this.getXLMPriceUSD();
    if (!Number.isFinite(usdPrice) || usdPrice <= 0) return 0.31;

    const RATE_CACHE_KEY = 'coingecko_eur_usd_rate';
    const cachedRate = cache.get<number>(RATE_CACHE_KEY);
    if (cachedRate !== null && Number.isFinite(cachedRate) && cachedRate > 0) {
      return usdPrice * cachedRate;
    }

    try {
      const response = await fetchWithTimeout('https://api.coingecko.com/api/v3/exchange_rates', undefined, 8000);
      const data = await response.json();

      let eurUsdRate = 0.85;
      if (data && data.rates && data.rates.eur && data.rates.usd) {
        const usdValue = Number(data.rates.usd.value);
        const eurValue = Number(data.rates.eur.value);
        const rate = usdValue / eurValue;
        if (Number.isFinite(rate) && rate > 0) {
          eurUsdRate = rate;
        }
      }

      cache.set(RATE_CACHE_KEY, eurUsdRate, 60_000);
      return usdPrice * eurUsdRate;
    } catch (error) {
      logger.error('Error fetching XLM price (EUR):', error);
      return 0.31;
    }
  }
} 