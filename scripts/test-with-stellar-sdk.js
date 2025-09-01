#!/usr/bin/env node

/**
 * Test script using Stellar SDK approach like sorobanService.ts
 */

// Import Stellar SDK (we'll use require for this test)
const StellarSdk = require('@stellar/stellar-sdk');

const { Account, BASE_FEE, Contract, Keypair, Networks, TransactionBuilder, scValToNative } = StellarSdk;

const DEFAULT_SOROBAN_RPC = 'https://mainnet.sorobanrpc.com';
const NETWORK_PASSPHRASE = Networks.PUBLIC;

// Pool contract IDs
const POOL_CONTRACTS = {
  CODY_USDC: 'CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU',
  CODY_XLM: 'CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW',
  CODY_AQUA: 'CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR'
};

// Token contract IDs
const TOKEN_CONTRACTS = {
  CODY: 'CAFD2IS6FEBUXWHAOH3G5LM4LMXIHVH6LAYRHUPYUU62NXH3I4TUCI2C',
  USDC: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
  AQUA: 'CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK'
};

async function simulateRead(contractId, method, args = []) {
  try {
    const server = new StellarSdk.SorobanRpc.Server(DEFAULT_SOROBAN_RPC, { 
      allowHttp: DEFAULT_SOROBAN_RPC.startsWith('http://') 
    });
    const sourceKP = Keypair.random();
    const source = new Account(sourceKP.publicKey(), '0');
    const contract = new Contract(contractId);

    let tx = new TransactionBuilder(source, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    // Prepare & simulate
    tx = await server.prepareTransaction(tx);
    const sim = await server.simulateTransaction(tx);
    if (!sim || sim.status !== 'SUCCESS' || !sim.result) return null;

    const retval = sim.result.retval;
    if (!retval) return null;

    return scValToNative(retval);
  } catch (error) {
    console.error(`Error in simulateRead for ${contractId}.${method}:`, error.message);
    return null;
  }
}

async function testPoolContract(poolContractId, poolName) {
  console.log(`\n🔍 Testing ${poolName} (${poolContractId})...`);
  console.log('=' .repeat(60));
  
  // Test common method names
  const methods = ['get_reserves', 'get_rsrvs', 'get_info', 'pool_info', 'reserves', 'info'];
  
  for (const method of methods) {
    try {
      console.log(`\n🧪 Trying method: ${method}`);
      const result = await simulateRead(poolContractId, method);
      
      if (result) {
        console.log(`✅ SUCCESS with method: ${method}`);
        console.log(`📊 Result:`, JSON.stringify(result, null, 2));
        
        // Try to parse the result
        if (Array.isArray(result) && result.length >= 2) {
          console.log(`💰 Parsed reserves: [${result[0]}, ${result[1]}]`);
        } else if (typeof result === 'object') {
          console.log(`💰 Object keys:`, Object.keys(result));
        }
        
        return { method, result };
      } else {
        console.log(`❌ No result for method: ${method}`);
      }
    } catch (error) {
      console.log(`❌ Error with method ${method}: ${error.message}`);
    }
  }
  
  return null;
}

async function testTokenContract(tokenContractId, tokenName) {
  console.log(`\n🔍 Testing ${tokenName} token (${tokenContractId})...`);
  console.log('=' .repeat(40));
  
  try {
    const decimals = await simulateRead(tokenContractId, 'decimals');
    if (decimals !== null) {
      console.log(`✅ ${tokenName} decimals: ${decimals}`);
      return decimals;
    } else {
      console.log(`❌ Could not get ${tokenName} decimals`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error getting ${tokenName} decimals: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🔍 Testing with Stellar SDK Approach');
  console.log('=' .repeat(60));
  
  // Test token decimals first
  console.log('\n🧪 Testing Token Decimals...');
  const tokenResults = {};
  for (const [tokenName, contractId] of Object.entries(TOKEN_CONTRACTS)) {
    tokenResults[tokenName] = await testTokenContract(contractId, tokenName);
  }
  
  // Test pool contracts
  console.log('\n🧪 Testing Pool Contracts...');
  const poolResults = {};
  for (const [poolName, poolContractId] of Object.entries(POOL_CONTRACTS)) {
    poolResults[poolName] = await testPoolContract(poolContractId, poolName);
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 SUMMARY:');
  
  console.log('\n🎯 Token Results:');
  for (const [tokenName, decimals] of Object.entries(tokenResults)) {
    if (decimals !== null) {
      console.log(`✅ ${tokenName}: ${decimals} decimals`);
    } else {
      console.log(`❌ ${tokenName}: Failed`);
    }
  }
  
  console.log('\n🏊 Pool Results:');
  for (const [poolName, result] of Object.entries(poolResults)) {
    if (result) {
      console.log(`✅ ${poolName}: ${result.method} method works`);
    } else {
      console.log(`❌ ${poolName}: No working method found`);
    }
  }
}

runTests().catch(console.error);
