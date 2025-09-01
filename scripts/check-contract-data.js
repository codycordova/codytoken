#!/usr/bin/env node

/**
 * Check if contracts exist and get basic contract data
 */

const SOROBAN_RPC = 'https://mainnet.sorobanrpc.com';

// Pool contract IDs
const POOL_CONTRACTS = {
  CODY_USDC: 'CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU',
  CODY_XLM: 'CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW',
  CODY_AQUA: 'CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR'
};

async function checkContract(contractId, contractName) {
  console.log(`\n🔍 Checking ${contractName} (${contractId})...`);
  console.log('=' .repeat(60));
  
  try {
    // Method 1: Check if contract exists
    console.log('🧪 Method 1: Checking if contract exists...');
    const response1 = await fetch(SOROBAN_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getLedgerEntries',
        params: {
          keys: [{
            keyType: 'contractData',
            contractId: contractId,
            key: 'AAAAAA==', // Empty key
            durability: 'persistent'
          }]
        }
      })
    });
    
    const data1 = await response1.json();
    console.log('📊 Response:', JSON.stringify(data1, null, 2));
    
    // Method 2: Try to get contract info
    console.log('\n🧪 Method 2: Getting contract info...');
    const response2 = await fetch(SOROBAN_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getLedgerEntries',
        params: {
          keys: [{
            keyType: 'contractCode',
            hash: contractId
          }]
        }
      })
    });
    
    const data2 = await response2.json();
    console.log('📊 Response:', JSON.stringify(data2, null, 2));
    
    // Method 3: Try to get account info (in case it's an account)
    console.log('\n🧪 Method 3: Getting account info...');
    const response3 = await fetch(SOROBAN_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccount',
        params: {
          accountId: contractId
        }
      })
    });
    
    const data3 = await response3.json();
    console.log('📊 Response:', JSON.stringify(data3, null, 2));
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function runChecks() {
  console.log('🔍 Checking Contract Data');
  console.log('=' .repeat(60));
  
  for (const [contractName, contractId] of Object.entries(POOL_CONTRACTS)) {
    await checkContract(contractId, contractName);
  }
}

runChecks().catch(console.error);
