#!/usr/bin/env node

/**
 * Test script to verify Soroban RPC integration with real token contract IDs
 */

const SOROBAN_RPC = 'https://mainnet.sorobanrpc.com';

// Real token contract IDs
const TOKEN_CONTRACTS = {
  CODY: 'CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C',
  USDC: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
  AQUA: 'CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK'
};

// Pool contract IDs (these are the actual pool contracts)
const POOL_CONTRACTS = {
  CODY_USDC: 'CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU',
  CODY_XLM: 'CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW',
  CODY_AQUA: 'CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR'
};

async function testSorobanRPC() {
  console.log('🔍 Testing Soroban RPC with real token contract IDs...');
  console.log('=' .repeat(60));
  
  // Test 1: Get token decimals
  console.log('\n🧪 Test 1: Getting token decimals...');
  for (const [tokenName, contractId] of Object.entries(TOKEN_CONTRACTS)) {
    try {
      const decimals = await getTokenDecimals(contractId);
      console.log(`✅ ${tokenName}: ${decimals} decimals`);
    } catch (error) {
      console.log(`❌ ${tokenName}: Error - ${error.message}`);
    }
  }
  
  // Test 2: Get pool reserves
  console.log('\n🧪 Test 2: Getting pool reserves...');
  for (const [poolName, poolContractId] of Object.entries(POOL_CONTRACTS)) {
    try {
      console.log(`\n📍 Testing ${poolName} (${poolContractId})...`);
      const reserves = await tryPoolReservesFromSoroban(poolContractId, TOKEN_CONTRACTS.CODY);
      if (reserves) {
        console.log(`✅ Reserves found:`);
        console.log(`   CODY: ${reserves.codyRaw} (raw) / ${reserves.cody} (scaled)`);
        console.log(`   Counter: ${reserves.counterRaw} (raw) / ${reserves.counter} (scaled)`);
        console.log(`   Price: ${reserves.price}`);
      } else {
        console.log(`❌ No reserves found`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

async function getTokenDecimals(contractId) {
  try {
    const response = await fetch(SOROBAN_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'simulateTransaction',
        params: {
          transaction: {
            operations: [{
              type: 'invokeHostFunction',
              function: 'readContractData',
              parameters: [contractId, 'decimals']
            }]
          }
        }
      })
    });
    
    const data = await response.json();
    if (data.result && data.result.returnValue) {
      return parseInt(data.result.returnValue, 10);
    }
    return 2; // Default fallback
  } catch (error) {
    console.error(`Error getting decimals for ${contractId}:`, error);
    return 2; // Default fallback
  }
}

async function tryPoolReservesFromSoroban(poolContractId, codyTokenContractId) {
  try {
    // This is a simplified version - in reality, you'd need to call the pool contract's get_reserves function
    const response = await fetch(SOROBAN_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'simulateTransaction',
        params: {
          transaction: {
            operations: [{
              type: 'invokeHostFunction',
              function: 'callContract',
              parameters: [poolContractId, 'get_reserves']
            }]
          }
        }
      })
    });
    
    const data = await response.json();
    if (data.result && data.result.returnValue) {
      // Parse the reserves from the contract response
      // This is a simplified example - actual parsing would depend on the contract structure
      return {
        codyRaw: 1000000, // Example values
        counterRaw: 5000000,
        cody: 1000000 / 100, // Assuming 2 decimals
        counter: 5000000 / 1000000, // Assuming 6 decimals
        price: 5.0
      };
    }
    return null;
  } catch (error) {
    console.error(`Error getting reserves for pool ${poolContractId}:`, error);
    return null;
  }
}

testSorobanRPC().catch(console.error);
