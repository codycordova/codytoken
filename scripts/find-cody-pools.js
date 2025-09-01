#!/usr/bin/env node

/**
 * Script to find CODY pools in the Aquarius API
 */

async function findCodyPools() {
  try {
    console.log('🔍 Searching for CODY pools in Aquarius API...');
    
    const response = await fetch('https://amm-api.aqua.network/api/external/v1/pools/');
    const data = await response.json();
    
    console.log(`📊 Found ${data.count} total pools`);
    
    // Search for CODY pools
    const codyPools = data.results.filter(pool => 
      pool.tokens_str.some(token => token.includes('CODY'))
    );
    
    console.log(`\n🎯 Found ${codyPools.length} CODY pools:`);
    
    codyPools.forEach((pool, index) => {
      console.log(`\n${index + 1}. Pool Address: ${pool.address}`);
      console.log(`   Tokens: ${pool.tokens_str.join(' / ')}`);
      console.log(`   Type: ${pool.pool_type}`);
      console.log(`   Fee: ${pool.fee}`);
      console.log(`   Volume: ${pool.total_volume}`);
      console.log(`   Transactions: ${pool.tx_count}`);
    });
    
    // Also search for pools with similar contract IDs
    console.log('\n🔍 Searching for pools with similar contract IDs...');
    
    const contractIds = [
      'CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU',
      'CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW',
      'CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR'
    ];
    
    contractIds.forEach(contractId => {
      const matchingPools = data.results.filter(pool => 
        pool.address === contractId || 
        pool.tokens_addresses.includes(contractId)
      );
      
      if (matchingPools.length > 0) {
        console.log(`\n✅ Found pools for contract ${contractId}:`);
        matchingPools.forEach(pool => {
          console.log(`   Pool Address: ${pool.address}`);
          console.log(`   Tokens: ${pool.tokens_str.join(' / ')}`);
        });
      } else {
        console.log(`\n❌ No pools found for contract ${contractId}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findCodyPools();
