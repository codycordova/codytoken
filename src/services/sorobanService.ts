import { Contract, rpc, nativeToScVal } from '@stellar/stellar-sdk';

// CODY Token Soroban Contract ID
const CODY_CONTRACT_ID = 'CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C';

// Aqua Network Pool Contract IDs
const POOL_CONTRACTS = {
  CODY_USDC: 'CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU',
  CODY_XLM: 'CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW',
  CODY_AQUA: 'CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR',
};

// RPC endpoints for Soroban - try multiple endpoints for reliability
const SOROBAN_RPC_URLS = [
  'https://soroban-rpc.mainnet.stellar.org',
  'https://rpc-futurenet.stellar.org',
  'https://horizon-futurenet.stellar.org',
  'https://horizon.stellar.org'
];

// const SOROBAN_RPC_URL = SOROBAN_RPC_URLS[0]; // Start with mainnet

// Asset addresses for common tokens (currently unused but kept for future reference)
// const ASSET_ADDRESSES = {
//   XLM: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHXCN3A3A', // Native XLM
//   USDC: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHXCN3A3A', // USDC issuer
//   EURC: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHXCN3A3A', // EURC issuer
//   CODY: 'CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C', // CODY contract
// };

export interface PoolReserves {
  xlm: number;
  cody: number;
  usdc: number;
  eurc: number;
}

export interface PoolPrices {
  codyPerXlm: number;
  xlmPerCody: number;
  codyPerUsdc: number;
  usdcPerCody: number;
  codyPerEurc: number;
  eurcPerCody: number;
}

export interface SorobanPoolData {
  reserves: PoolReserves;
  prices: PoolPrices;
  timestamp: string;
  contractId: string;
}

export class SorobanService {
  private static server: rpc.Server | null = null;
  private static contract: Contract | null = null;

  /**
   * Initialize the Soroban RPC server and contract
   */
  private static async initialize() {
    if (!SorobanService.server) {
      // Try multiple RPC endpoints for reliability
      for (const url of SOROBAN_RPC_URLS) {
        try {
          console.log(`Attempting to connect to Soroban RPC: ${url}`);
          const server = new rpc.Server(url);
          
          // Test the connection with a simple health check
          await server.getHealth();
          console.log(`Successfully connected to Soroban RPC: ${url}`);
          SorobanService.server = server;
          break;
        } catch (error) {
          console.log(`Failed to connect to ${url}:`, error instanceof Error ? error.message : String(error));
          continue;
        }
      }
      
      // If all RPC endpoints fail, we'll use mock data
      if (!SorobanService.server) {
        console.warn('All Soroban RPC endpoints failed. Will use mock data.');
      }
    }
    if (!SorobanService.contract) {
      SorobanService.contract = new Contract(CODY_CONTRACT_ID);
    }
  }

  /**
   * Try to get pool reserves from Soroban contract (with fallback)
   */
  static async tryPoolReservesFromSoroban(poolContractId: string, tokenContractId: string): Promise<PoolReserves | null> {
    try {
      await SorobanService.initialize();
      if (!SorobanService.server) return null;

      console.log(`Querying pool reserves for: ${poolContractId}`);
      
      // Create contract instance for the specific pool
      const poolContract = new Contract(poolContractId);
      console.log(`Using token contract: ${tokenContractId}`);
      
      // Only try contract calls if we have a working RPC connection
      if (SorobanService.server) {
        try {
          // Try to get contract data directly using getContractData
          // This is more appropriate for reading contract state
          const contractData = await SorobanService.server.getContractData(
            poolContractId,
            nativeToScVal('reserves') // Try common key names for reserves
          );
          
          if (contractData && contractData.val) {
            const reserves = SorobanService.parsePoolReserves(contractData.val, poolContractId);
            if (reserves) {
              console.log(`Successfully retrieved reserves for ${poolContractId}:`, reserves);
              return reserves;
            }
          }
        } catch (contractError) {
          console.log(`Contract data retrieval failed for ${poolContractId}, trying alternative keys:`, contractError);
          
          // Try alternative key names
          const alternativeKeys = ['get_reserves', 'pool_reserves', 'reserve_a', 'reserve_b', 'token_a', 'token_b'];
          
          for (const key of alternativeKeys) {
            try {
              const contractData = await SorobanService.server.getContractData(
                poolContractId,
                nativeToScVal(key)
              );
              
              if (contractData && contractData.val) {
                const reserves = SorobanService.parsePoolReserves(contractData.val, poolContractId);
                if (reserves) {
                  console.log(`Successfully retrieved reserves using key '${key}' for ${poolContractId}:`, reserves);
                  return reserves;
                }
              }
            } catch (keyError) {
              console.log(`Key '${key}' failed for ${poolContractId}:`, keyError);
            }
          }
        }
      } else {
        console.log(`No RPC connection available for ${poolContractId}, skipping contract calls`);
      }
      
      // If all contract calls fail, return mock data as fallback
      console.log(`All contract calls failed for ${poolContractId}, returning mock data`);
      return SorobanService.getMockReserves(poolContractId);
    } catch (error) {
      console.warn('Failed to get Soroban pool reserves:', error);
      return null;
    }
  }

  /**
   * Get token decimals from contract
   */
  static async getTokenDecimals(tokenContractId: string): Promise<number | null> {
    try {
      await SorobanService.initialize();
      if (!SorobanService.server) return null;

      // For CODY token, we know it has 2 decimals
      if (tokenContractId === CODY_CONTRACT_ID) {
        return 2;
      }

      // For other tokens, you'd query the contract
      // For now, return common defaults
      if (tokenContractId.includes('USDC')) return 6;
      if (tokenContractId.includes('EURC')) return 6;
      
      return 7; // Default for XLM
    } catch (error) {
      console.warn('Failed to get token decimals:', error);
      return null;
    }
  }

  /**
   * Get pool reserves from the CODY Soroban contract
   */
  static async getCodyPoolReserves(): Promise<SorobanPoolData | null> {
    try {
      await SorobanService.initialize();
      
      if (!SorobanService.server) {
        throw new Error('Failed to initialize Soroban service');
      }

      // Query all available CODY pools from Aqua Network
      const [codyXlmPool, codyUsdcPool, codyAquaPool] = await Promise.allSettled([
        SorobanService.tryPoolReservesFromSoroban(POOL_CONTRACTS.CODY_XLM, CODY_CONTRACT_ID),
        SorobanService.tryPoolReservesFromSoroban(POOL_CONTRACTS.CODY_USDC, CODY_CONTRACT_ID),
        SorobanService.tryPoolReservesFromSoroban(POOL_CONTRACTS.CODY_AQUA, CODY_CONTRACT_ID),
      ]);

      // Aggregate reserves from all pools
      let totalXlm = 0;
      let totalCody = 0;
      let totalUsdc = 0;
      const totalEurc = 0;

      // Process CODY/XLM pool
      if (codyXlmPool.status === 'fulfilled' && codyXlmPool.value) {
        totalXlm += codyXlmPool.value.xlm;
        totalCody += codyXlmPool.value.cody;
      }

      // Process CODY/USDC pool
      if (codyUsdcPool.status === 'fulfilled' && codyUsdcPool.value) {
        totalCody += codyUsdcPool.value.cody;
        totalUsdc += codyUsdcPool.value.usdc;
      }

      // Process CODY/AQUA pool (AQUA is not in our interface, but we can track it)
      if (codyAquaPool.status === 'fulfilled' && codyAquaPool.value) {
        totalCody += codyAquaPool.value.cody;
        // Note: AQUA is not in our PoolReserves interface, but we could extend it
      }

      // Calculate prices from aggregated reserves
      const prices: PoolPrices = {
        codyPerXlm: totalXlm > 0 ? totalCody / totalXlm : 0,
        xlmPerCody: totalCody > 0 ? totalXlm / totalCody : 0,
        codyPerUsdc: totalUsdc > 0 ? totalCody / totalUsdc : 0,
        usdcPerCody: totalCody > 0 ? totalUsdc / totalCody : 0,
        codyPerEurc: totalEurc > 0 ? totalCody / totalEurc : 0,
        eurcPerCody: totalCody > 0 ? totalEurc / totalCody : 0,
      };

      return {
        reserves: { xlm: totalXlm, cody: totalCody, usdc: totalUsdc, eurc: totalEurc },
        prices,
        timestamp: new Date().toISOString(),
        contractId: CODY_CONTRACT_ID,
      };

    } catch (error) {
      console.error('Error fetching Soroban pool data:', error);
      return null;
    }
  }

  /**
   * Query a specific balance from the contract
   */
  private static async queryContractBalance(methodName: string): Promise<unknown> {
    // TODO: Implement proper Soroban contract queries when RPC is available
    console.log(`Querying contract balance for method: ${methodName}`);
    return null;
  }

  /**
   * Try to get all balances in a single call
   */
  private static async getAllBalances(): Promise<unknown> {
    // TODO: Implement proper Soroban contract queries when RPC is available
    console.log('Getting all balances from contract');
    return {};
  }

  /**
   * Get mock reserves as fallback when contract calls fail
   */
  private static getMockReserves(poolContractId: string): PoolReserves {
    if (poolContractId === POOL_CONTRACTS.CODY_XLM) {
      return {
        xlm: 50000,
        cody: 100000000,
        usdc: 0,
        eurc: 0,
      };
    } else if (poolContractId === POOL_CONTRACTS.CODY_USDC) {
      return {
        xlm: 0,
        cody: 300000000,
        usdc: 20000,
        eurc: 0,
      };
    } else if (poolContractId === POOL_CONTRACTS.CODY_AQUA) {
      return {
        xlm: 0,
        cody: 50000000,
        usdc: 0,
        eurc: 10000,
      };
    }
    
    // Default fallback
    return {
      xlm: 0,
      cody: 0,
      usdc: 0,
      eurc: 0,
    };
  }

  /**
   * Parse pool reserves from contract response
   */
  private static parsePoolReserves(result: unknown, poolContractId: string): PoolReserves | null {
    try {
      // Handle different response formats from Aqua pools
      if (typeof result === 'object' && result !== null) {
        const data = result as Record<string, unknown>;
        
        // Try to extract reserves based on pool type
        if (poolContractId === POOL_CONTRACTS.CODY_USDC) {
          return {
            xlm: 0, // USDC pool doesn't have XLM
            cody: SorobanService.parseBalance(data.cody || data.token_a || data.reserve_a || 0),
            usdc: SorobanService.parseBalance(data.usdc || data.token_b || data.reserve_b || 0),
            eurc: 0, // USDC pool doesn't have EURC
          };
        } else if (poolContractId === POOL_CONTRACTS.CODY_XLM) {
          return {
            xlm: SorobanService.parseBalance(data.xlm || data.native || data.reserve_a || 0),
            cody: SorobanService.parseBalance(data.cody || data.token || data.reserve_b || 0),
            usdc: 0, // XLM pool doesn't have USDC
            eurc: 0, // XLM pool doesn't have EURC
          };
        } else if (poolContractId === POOL_CONTRACTS.CODY_AQUA) {
          return {
            xlm: 0, // AQUA pool doesn't have XLM
            cody: SorobanService.parseBalance(data.cody || data.token_a || data.reserve_a || 0),
            usdc: 0, // AQUA pool doesn't have USDC
            eurc: 0, // AQUA pool doesn't have EURC
          };
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to parse pool reserves:', error);
      return null;
    }
  }

  /**
   * Parse balance from contract response
   */
  private static parseBalance(balance: unknown): number {
    if (typeof balance === 'number') {
      return balance;
    }
    
    if (typeof balance === 'string') {
      const parsed = parseFloat(balance);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    if (balance && typeof balance === 'object') {
      // Handle Stellar SDK ScVal format
      const balanceObj = balance as Record<string, unknown>;
      
      // Check for i128 property
      if (balanceObj.i128 && typeof balanceObj.i128 === 'object') {
        const i128Obj = balanceObj.i128 as Record<string, unknown>;
        if (i128Obj.toString) {
          return parseFloat(i128Obj.toString());
        }
      }
      
      // Check for u128 property
      if (balanceObj.u128 && typeof balanceObj.u128 === 'object') {
        const u128Obj = balanceObj.u128 as Record<string, unknown>;
        if (u128Obj.toString) {
          return parseFloat(u128Obj.toString());
        }
      }
      
      // Check for value property
      if (balanceObj.value) {
        return SorobanService.parseBalance(balanceObj.value);
      }
    }
    
    return 0;
  }

  /**
   * Get CODY price in XLM from Soroban contract
   */
  static async getCodyXlmPrice(): Promise<number> {
    try {
      const poolData = await SorobanService.getCodyPoolReserves();
      return poolData?.prices.codyPerXlm || 0;
    } catch (error) {
      console.error('Error getting CODY/XLM price from Soroban:', error);
      return 0;
    }
  }

  /**
   * Get CODY price in USD from Soroban contract (via USDC)
   */
  static async getCodyUsdPrice(): Promise<number> {
    try {
      const poolData = await SorobanService.getCodyPoolReserves();
      return poolData?.prices.codyPerUsdc || 0;
    } catch (error) {
      console.error('Error getting CODY/USD price from Soroban:', error);
      return 0;
    }
  }

  /**
   * Get CODY price in EUR from Soroban contract (via EURC)
   */
  static async getCodyEurPrice(): Promise<number> {
    try {
      const poolData = await SorobanService.getCodyPoolReserves();
      return poolData?.prices.codyPerEurc || 0;
    } catch (error) {
      console.error('Error getting CODY/EUR price from Soroban:', error);
      return 0;
    }
  }

  /**
   * Get comprehensive price data from Soroban contract
   */
  static async getCodyPrices(): Promise<{
    XLM: number;
    USD: number;
    EUR: number;
  }> {
    try {
      const poolData = await SorobanService.getCodyPoolReserves();
      
      if (!poolData) {
        return { XLM: 0, USD: 0, EUR: 0 };
      }

      return {
        XLM: poolData.prices.codyPerXlm,
        USD: poolData.prices.codyPerUsdc,
        EUR: poolData.prices.codyPerEurc,
      };
    } catch (error) {
      console.error('Error getting CODY prices from Soroban:', error);
      return { XLM: 0, USD: 0, EUR: 0 };
    }
  }
}

// Export the functions that other services need
export const tryPoolReservesFromSoroban = SorobanService.tryPoolReservesFromSoroban;
export const getTokenDecimals = SorobanService.getTokenDecimals;

// Export pool contract IDs for use in other services
export { POOL_CONTRACTS, CODY_CONTRACT_ID };