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
    pool?: {
      price: number;
      reserves: {
        cody: number;
        xlm: number;
      };
    };
    oracle?: {
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