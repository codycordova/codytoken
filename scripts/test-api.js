#!/usr/bin/env node

const fetch = require('node-fetch');

async function testPriceAPI() {
  console.log('🧪 Testing CODY Token Price API...\n');

  try {
    // Test REST API
    console.log('📡 Testing REST API endpoint...');
    const response = await fetch('http://localhost:3000/api/price');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ REST API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Validate response structure
    const requiredFields = ['symbol', 'issuer', 'price', 'sources', 'metadata'];
    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return false;
    }

    console.log('✅ Response structure is valid');
    
    // Test WebSocket connection
    console.log('\n📡 Testing WebSocket connection...');
    const WebSocket = require('ws');
    const ws = new WebSocket('ws://localhost:3030');
    
    return new Promise((resolve) => {
      let messageReceived = false;
      
      ws.on('open', () => {
        console.log('✅ WebSocket connected');
      });
      
      ws.on('message', (data) => {
        if (!messageReceived) {
          console.log('✅ WebSocket message received:');
          const message = JSON.parse(data.toString());
          console.log(JSON.stringify(message, null, 2));
          messageReceived = true;
          ws.close();
        }
      });
      
      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error.message);
        resolve(false);
      });
      
      ws.on('close', () => {
        console.log('✅ WebSocket test completed');
        resolve(true);
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!messageReceived) {
          console.error('❌ WebSocket timeout - no message received');
          ws.close();
          resolve(false);
        }
      }, 10000);
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testPriceAPI().then((success) => {
  if (success) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed!');
    process.exit(1);
  }
}).catch((error) => {
  console.error('💥 Test error:', error);
  process.exit(1);
}); 