#!/usr/bin/env node

/**
 * Test script to find the correct Aquarius API endpoints
 */

const BASE_URL = 'https://amm-api.aqua.network/api/external/v1';

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\n🧪 Testing ${description}...`);
    console.log(`📍 Endpoint: ${BASE_URL}${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`);
    console.log(`✅ Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`📊 Response:`, JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log(`❌ Failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🔍 Testing Aquarius API Endpoints');
  console.log('=' .repeat(50));
  
  const tests = [
    { endpoint: '/pools', description: 'List all pools' },
    { endpoint: '/pools/CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU', description: 'CODY/USDC pool' },
    { endpoint: '/pools/CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW', description: 'CODY/XLM pool' },
    { endpoint: '/pools/CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR', description: 'CODY/AQUA pool' },
    { endpoint: '/tokens', description: 'List all tokens' },
    { endpoint: '/stats', description: 'API stats' },
    { endpoint: '/health', description: 'Health check' }
  ];
  
  let working = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const success = await testEndpoint(test.endpoint, test.description);
    if (success) working++;
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`📊 Results: ${working}/${total} endpoints working`);
  
  if (working === 0) {
    console.log('⚠️  No endpoints working - API might be down or have different structure');
  } else {
    console.log('✅ Found working endpoints!');
  }
}

runTests().catch(console.error);
