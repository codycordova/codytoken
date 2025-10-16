export interface PriceData {
  symbol: string;
  issuer: string;
  price: {
    XLM: number;
    USD: number;
    EUR: number;
  };
  sources: {
    dex: {
      bid: number;
      ask: number;
      spread: number;
      volume24h: number;
    };
    pool: {
      price: number;
      reserves: {
        cody: number;
        xlm: number;
      };
    };
    aqua: {
      pools: {
        codyUsdc: AquaPoolData;
        codyXlm: AquaPoolData;
        codyAqua: AquaPoolData;
      };
      aggregatedPrice: {
        XLM: number;
        USD: number;
        EUR: number;
      };
    };
    soroban: {
      reserves: {
        xlm: number;
        cody: number;
        usdc: number;
        eurc: number;
      };
      prices: {
        codyPerXlm: number;
        xlmPerCody: number;
        codyPerUsdc: number;
        usdcPerCody: number;
        codyPerEurc: number;
        eurcPerCody: number;
      };
      contractId: string;
    };
    oracle: {
      price: number;
      confidence: number;
    };
  };
  metadata: {
    confidence: number;
    lastUpdate: string;
    cacheAge: number;
  };
}

export interface AquaPoolData {
  poolId: string;
  pair: string;
  tvl: number;
  volume24h: number;
  baseAPY: number;
  rewardsAPY: number;
  fee: number;
  price: number;
  reserves: {
    cody: number;
    counter: number;
  };
  timestamp: string;
}

export interface TradeData {
  price: number;
  amount: number;
  timestamp: string;
  side: 'buy' | 'sell';
}

export interface OrderbookData {
  bids: Array<[number, number]>; // [price, amount]
  asks: Array<[number, number]>; // [price, amount]
  spread: number;
  timestamp: string;
}

export interface LiquidityPoolData {
  reserves: {
    cody: number;
    xlm: number;
  };
  price: number;
  timestamp: string;
} 