export interface PriceData {
  price: {
    USD: number;
    XLM: number;
    EUR: number;
  };
  bid: number;
  ask: number;
  spread: number;
  volume24h: number;
  lastUpdate: string;
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