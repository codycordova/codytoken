/* eslint-disable @typescript-eslint/no-explicit-any */
import { tryPoolReservesFromSoroban, getTokenDecimals } from './sorobanService';

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

export interface AquaPriceData {
  pools: {
    codyUsdc: AquaPoolData | null;
    codyXlm: AquaPoolData | null;
    codyAqua: AquaPoolData | null;
  };
  aggregatedPrice: {
    XLM: number;
    USD: number;
    EUR: number;
  };
  confidence: number;
  lastUpdate: string;
}

export class AquaService {
  // The contract ID of the Aquarius AMM contract
  private static readonly ROUTER_CONTRACT_ID = "CBQDHNBFBZYE4MKPWBSJOPIYLW4SFSXAXUTSXJN76GNKYVYPCKWC6QUK";
  // Soroban RPC server address
  private static readonly SOROBAN_RPC_SERVER = "https://mainnet.sorobanrpc.com";
  // Horizon server address
  private static readonly HORIZON_SERVER = "https://horizon.stellar.org";
  // Aquarius backend API URL
  private static readonly BASE_API = "https://amm-api.aqua.network/api/external/v1";
  
  // Pool contract IDs
  private static readonly POOL_CONTRACTS = {
    CODY_USDC: 'CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU',
    CODY_XLM: 'CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW',
    CODY_AQUA: 'CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR'
  };

  // Token contract IDs (real Soroban contract addresses)
  private static readonly TOKEN_CONTRACTS = {
    CODY: process.env.CODY_TOKEN_CONTRACT || 'CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C',
    USDC: process.env.USDC_TOKEN_CONTRACT || 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
    AQUA: process.env.AQUA_TOKEN_CONTRACT || 'CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK'
  };

  /**
   * Fetch pool data from Aquarius AMM API
   */
  static async getPoolData(poolContractId: string): Promise<AquaPoolData | null> {
    try {
      // First try to get data from Aquarius API
      const apiResponse = await fetch(`${this.BASE_API}/pools/${poolContractId}`);
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        return this.parseApiPoolData(apiData, poolContractId);
      }

      // Fallback to Soroban RPC for reserves
      const reserves = await tryPoolReservesFromSoroban(poolContractId, this.TOKEN_CONTRACTS.CODY);
      if (reserves) {
        return this.createPoolDataFromReserves(reserves, poolContractId);
      }

      return null;
    } catch (error) {
      console.error(`Error fetching pool ${poolContractId}:`, error);
      return null;
    }
  }

  /**
   * Parse pool data from Aquarius API response
   */
  private static parseApiPoolData(apiData: any, poolContractId: string): AquaPoolData {
    const pool = apiData.pool || apiData;
    
    // Extract reserves and calculate price
    const reserves = pool.reserves || [];
    const codyReserve = reserves.find((r: any) => 
      r.asset?.includes('CODY') || r.token?.includes('CODY') || r.contract_id === this.TOKEN_CONTRACTS.CODY
    );
    const counterReserve = reserves.find((r: any) => 
      !r.asset?.includes('CODY') && !r.token?.includes('CODY') && r.contract_id !== this.TOKEN_CONTRACTS.CODY
    );

    const codyAmount = codyReserve ? parseFloat(codyReserve.amount || '0') : 0;
    const counterAmount = counterReserve ? parseFloat(counterReserve.amount || '0') : 0;
    const price = codyAmount > 0 ? counterAmount / codyAmount : 0;

    return {
      poolId: poolContractId,
      pair: pool.pair || pool.name || 'CODY/UNKNOWN',
      tvl: parseFloat(pool.tvl || '0'),
      volume24h: parseFloat(pool.volume24h || '0'),
      baseAPY: parseFloat(pool.baseAPY || '0'),
      rewardsAPY: parseFloat(pool.rewardsAPY || '0'),
      fee: parseFloat(pool.fee || '0.1'),
      price,
      reserves: {
        cody: codyAmount,
        counter: counterAmount
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create pool data from Soroban reserves
   */
  private static async createPoolDataFromReserves(reserves: any, poolContractId: string): Promise<AquaPoolData> {
    // Get token decimals for proper scaling
    const codyDecimals = await getTokenDecimals(this.TOKEN_CONTRACTS.CODY) || 2;
    const counterDecimals = 6; // Assume USDC/XLM decimals
    
    const codyScale = Math.pow(10, codyDecimals);
    const counterScale = Math.pow(10, counterDecimals);
    
    const codyAmount = reserves.codyRaw / codyScale;
    const counterAmount = reserves.counterRaw / counterScale;
    const price = codyAmount > 0 ? counterAmount / codyAmount : 0;

    return {
      poolId: poolContractId,
      pair: 'CODY/UNKNOWN', // Will be determined by counter token
      tvl: 0, // Would need additional API call to get TVL
      volume24h: 0, // Would need additional API call to get volume
      baseAPY: 0, // Would need additional API call to get APY
      rewardsAPY: 0, // Would need additional API call to get rewards APY
      fee: 0.1, // Default fee
      price,
      reserves: {
        cody: codyAmount,
        counter: counterAmount
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Fetch all CODY pool data from Aqua
   */
  static async getAllCodyPools(): Promise<AquaPriceData> {
    try {
             // Fetch all pools in parallel
       const [codyUsdc, codyXlm, codyAqua] = await Promise.allSettled([
         this.getPoolData(this.POOL_CONTRACTS.CODY_USDC),
         this.getPoolData(this.POOL_CONTRACTS.CODY_XLM),
         this.getPoolData(this.POOL_CONTRACTS.CODY_AQUA)
       ]);

      const pools = {
        codyUsdc: codyUsdc.status === 'fulfilled' ? codyUsdc.value : null,
        codyXlm: codyXlm.status === 'fulfilled' ? codyXlm.value : null,
        codyAqua: codyAqua.status === 'fulfilled' ? codyAqua.value : null
      };

             // Calculate aggregated price
       let weightedPriceXLM = 0;
       let weightedPriceUSD = 0;

       // Use CODY/XLM pool as primary source for XLM price
       if (pools.codyXlm && pools.codyXlm.price > 0) {
         weightedPriceXLM = pools.codyXlm.price;
       }

       // Use CODY/USDC pool for USD price (convert USDC to USD)
       if (pools.codyUsdc && pools.codyUsdc.price > 0) {
         // USDC is pegged to USD, so price is direct
         weightedPriceUSD = pools.codyUsdc.price;
       }

      // Calculate EUR price (approximate conversion)
      const eurUsdRate = 0.85; // Approximate EUR/USD rate
      const weightedPriceEUR = weightedPriceUSD * eurUsdRate;

      // Calculate confidence based on available data
      let confidence = 0.3; // Base confidence
      if (pools.codyXlm) confidence += 0.3;
      if (pools.codyUsdc) confidence += 0.3;
      if (pools.codyAqua) confidence += 0.1;

      return {
        pools,
        aggregatedPrice: {
          XLM: weightedPriceXLM,
          USD: weightedPriceUSD,
          EUR: weightedPriceEUR
        },
        confidence: Math.min(confidence, 0.95),
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching Aqua pool data:', error);
      
      return {
        pools: {
          codyUsdc: null,
          codyXlm: null,
          codyAqua: null
        },
        aggregatedPrice: {
          XLM: 0,
          USD: 0,
          EUR: 0
        },
        confidence: 0.1,
        lastUpdate: new Date().toISOString()
      };
    }
  }

  /**
   * Get XLM price in USD for conversion
   */
  static async getXLMPriceUSD(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd');
      const data = await response.json();
      
      if (data && data.stellar && data.stellar.usd) {
        return data.stellar.usd;
      }
      
      return 0.37; // Fallback value
    } catch (error) {
      console.error('Error fetching XLM price:', error);
      return 0.37; // Fallback value
    }
  }

     /**
    * Get specific pool by pair name
    */
   static async getPoolByPair(pair: string): Promise<AquaPoolData | null> {
     const pairMap: Record<string, string> = {
       'CODY/USDC': this.POOL_CONTRACTS.CODY_USDC,
       'CODY/XLM': this.POOL_CONTRACTS.CODY_XLM,
       'CODY/AQUA': this.POOL_CONTRACTS.CODY_AQUA
     };

     const poolContractId = pairMap[pair.toUpperCase()];
     if (!poolContractId) {
       console.warn(`Unknown pair: ${pair}`);
       return null;
     }

     return this.getPoolData(poolContractId);
   }
}
