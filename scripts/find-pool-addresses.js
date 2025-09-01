#!/usr/bin/env node

/**
 * Script to find pool addresses using Soroban RPC
 */

const SOROBAN_RPC = 'https://mainnet.sorobanrpc.com';

async function findPoolAddresses() {
  console.log('🔍 Finding pool addresses using Soroban RPC...');
  
  const poolContracts = [
    'CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU',
    'CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW',
    'CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR'
  ];
  
  for (const contractId of poolContracts) {
    try {
      console.log(`\n🧪 Testing contract: ${contractId}`);
      
      // Try to get contract data
      const response = await fetch(SOROBAN_RPC, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getLedgerEntries',
          params: {
            keys: [{
              keyType: 'contractData',
              contractId: contractId,
              key: 'AAAAAA==', // Empty key to get contract info
              durability: 'persistent'
            }]
          }
        })
      });
      
      const data = await response.json();
      console.log(`✅ Response:`, JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error(`❌ Error for ${contractId}:`, error.message);
    }
  }
}

findPoolAddresses();
