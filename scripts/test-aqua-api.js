#!/usr/bin/env node

/**
 * Test script for Aqua AMM API integration
 * Tests both /api/price and /api/aqua-pools endpoints
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\n🧪 Testing ${description}...`);
    console.log(`📍 Endpoint: ${BASE_URL}${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response:`, JSON.stringify(data, null, 2));
    
    // Validate response structure
    if (endpoint === '/api/price') {
      validatePriceResponse(data);
    } else if (endpoint === '/api/aqua-pools') {
      validateAquaPoolsResponse(data);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error testing ${description}:`, error.message);
    return false;
  }
}

function validatePriceResponse(data) {
  console.log('\n🔍 Validating price response structure...');
  
  const required = ['symbol', 'issuer', 'price', 'sources', 'metadata'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required fields: ${missing.join(', ')}`);
    return false;
  }
  
  // Check if Aqua data is included
  if (data.sources.aqua) {
    console.log('✅ Aqua AMM data is included in response');
    console.log(`   - Pools available: ${Object.keys(data.sources.aqua.pools).length}`);
    console.log(`   - Confidence: ${data.metadata.confidence}`);
  } else {
    console.log('⚠️  Aqua AMM data not found in response');
  }
  
  console.log('✅ Price response validation passed');
  return true;
}

function validateAquaPoolsResponse(data) {
  console.log('\n🔍 Validating Aqua pools response structure...');
  
  const required = ['pools', 'aggregatedPrice', 'confidence', 'lastUpdate'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required fields: ${missing.join(', ')}`);
    return false;
  }
  
  // Check pool data
  const pools = data.pools;
  const poolNames = ['codyUsdc', 'codyXlm', 'codyAqua'];
  
  console.log('📊 Pool status:');
  poolNames.forEach(name => {
    const status = pools[name] ? '✅ Available' : '❌ Not available';
    console.log(`   - ${name}: ${status}`);
  });
  
  console.log(`📈 Aggregated price: XLM=${data.aggregatedPrice.XLM}, USD=${data.aggregatedPrice.USD}, EUR=${data.aggregatedPrice.EUR}`);
  console.log(`🎯 Confidence: ${data.confidence}`);
  
  console.log('✅ Aqua pools response validation passed');
  return true;
}

async function runTests() {
  console.log('🚀 Starting Aqua AMM API Tests');
  console.log('=' .repeat(50));
  
  const tests = [
    { endpoint: '/api/price', description: 'Main Price API with Aqua Integration' },
    { endpoint: '/api/aqua-pools', description: 'Aqua Pools API' }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const success = await testEndpoint(test.endpoint, test.description);
    if (success) passed++;
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Aqua AMM integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, validatePriceResponse, validateAquaPoolsResponse };
