#!/usr/bin/env node

/**
 * Debug script to find the correct method names for pool contracts
 */

const SOROBAN_RPC = 'https://mainnet.sorobanrpc.com';

// Pool contract IDs
const POOL_CONTRACTS = {
  CODY_USDC: 'CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU',
  CODY_XLM: 'CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW',
  CODY_AQUA: 'CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR'
};

// Common method names to try
const METHOD_CANDIDATES = [
  'get_reserves',
  'get_rsrvs', 
  'get_info',
  'pool_info',
  'reserves',
  'get_pool_info',
  'get_pool_data',
  'get_balance',
  'get_balances',
  'get_tokens',
  'get_assets',
  'get_liquidity',
  'get_total_supply',
  'get_supply',
  'info',
  'data',
  'state',
  'get_state'
];

async function debugPoolContract(poolContractId, poolName) {
  console.log(`\n🔍 Debugging ${poolName} (${poolContractId})...`);
  console.log('=' .repeat(60));
  
  for (const method of METHOD_CANDIDATES) {
    try {
      console.log(`\n🧪 Trying method: ${method}`);
      
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
                parameters: [poolContractId, method]
              }]
            }
          }
        })
      });
      
      const data = await response.json();
      
      if (data.result && data.result.returnValue) {
        console.log(`✅ SUCCESS with method: ${method}`);
        console.log(`📊 Response:`, JSON.stringify(data.result, null, 2));
        return method;
      } else if (data.error) {
        console.log(`❌ Error: ${data.error.message}`);
      } else {
        console.log(`⚠️  No return value`);
      }
      
    } catch (error) {
      console.log(`❌ Exception: ${error.message}`);
    }
  }
  
  return null;
}

async function runDebug() {
  console.log('🔍 Debugging Pool Contracts');
  console.log('=' .repeat(60));
  
  const results = {};
  
  for (const [poolName, poolContractId] of Object.entries(POOL_CONTRACTS)) {
    const workingMethod = await debugPoolContract(poolContractId, poolName);
    results[poolName] = workingMethod;
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 SUMMARY:');
  for (const [poolName, method] of Object.entries(results)) {
    if (method) {
      console.log(`✅ ${poolName}: ${method}`);
    } else {
      console.log(`❌ ${poolName}: No working method found`);
    }
  }
}

runDebug().catch(console.error);
