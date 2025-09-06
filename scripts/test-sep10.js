/**
 * Test script for SEP-10 JWT implementation
 * 
 * This script tests the complete SEP-10 flow:
 * 1. Request a challenge transaction
 * 2. Sign the transaction (simulated)
 * 3. Submit the signed transaction
 * 4. Receive and validate the JWT token
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_ACCOUNT = 'GCNBBQLCRN7AHIQ72LRQU24UZNS5ZCIL7HUXPBA326UUMTRHT550A5ET'; // Example Stellar account

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test functions
async function testChallengeGeneration() {
  console.log('🧪 Testing SEP-10 challenge generation...');
  
  try {
    const url = `${BASE_URL}/api/sep10?account=${TEST_ACCOUNT}`;
    const response = await makeRequest(url);
    
    if (response.status === 200) {
      console.log('✅ Challenge generation successful');
      console.log('📋 Response:', {
        hasTransaction: !!response.data.transaction,
        hasNetworkPassphrase: !!response.data.network_passphrase,
        transactionLength: response.data.transaction?.length || 0
      });
      return response.data;
    } else {
      console.log('❌ Challenge generation failed');
      console.log('📋 Response:', response);
      return null;
    }
  } catch (error) {
    console.log('❌ Challenge generation error:', error.message);
    return null;
  }
}

async function testChallengeValidation(challengeData) {
  console.log('\n🧪 Testing SEP-10 challenge validation...');
  
  if (!challengeData) {
    console.log('❌ No challenge data to validate');
    return null;
  }

  try {
    // In a real implementation, you would sign the transaction here
    // For testing, we'll submit the unsigned transaction (this will fail, but we can test the endpoint)
    const url = `${BASE_URL}/api/sep10`;
    const response = await makeRequest(url, {
      method: 'POST',
      body: {
        transaction: challengeData.transaction
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Challenge validation successful');
      console.log('📋 Response:', {
        hasToken: !!response.data.token,
        tokenType: response.data.type,
        tokenLength: response.data.token?.length || 0
      });
      return response.data;
    } else {
      console.log('❌ Challenge validation failed (expected for unsigned transaction)');
      console.log('📋 Response:', response);
      return null;
    }
  } catch (error) {
    console.log('❌ Challenge validation error:', error.message);
    return null;
  }
}

async function testJWTValidation(tokenData) {
  console.log('\n🧪 Testing JWT token structure...');
  
  if (!tokenData || !tokenData.token) {
    console.log('❌ No token data to validate');
    return false;
  }

  try {
    // Basic JWT structure validation
    const token = tokenData.token;
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.log('❌ Invalid JWT structure (should have 3 parts)');
      return false;
    }

    // Decode header and payload (without verification)
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    
    console.log('✅ JWT structure is valid');
    console.log('📋 JWT Header:', header);
    console.log('📋 JWT Payload:', {
      iss: payload.iss,
      sub: payload.sub,
      iat: new Date(payload.iat * 1000).toISOString(),
      exp: new Date(payload.exp * 1000).toISOString(),
      jti: payload.jti
    });
    
    return true;
  } catch (error) {
    console.log('❌ JWT validation error:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting SEP-10 JWT Implementation Tests');
  console.log('📍 Base URL:', BASE_URL);
  console.log('👤 Test Account:', TEST_ACCOUNT);
  console.log('=' .repeat(60));

  // Test 1: Challenge Generation
  const challengeData = await testChallengeGeneration();
  
  // Test 2: Challenge Validation (will fail with unsigned transaction, but tests the endpoint)
  const tokenData = await testChallengeValidation(challengeData);
  
  // Test 3: JWT Structure Validation (if we got a token)
  if (tokenData) {
    await testJWTValidation(tokenData);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Tests completed');
  
  if (challengeData) {
    console.log('✅ SEP-10 challenge generation is working');
  } else {
    console.log('❌ SEP-10 challenge generation needs attention');
  }
  
  console.log('ℹ️  Note: Challenge validation will fail with unsigned transactions (this is expected)');
  console.log('ℹ️  To fully test, you would need to sign the transaction with the Stellar SDK');
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testChallengeGeneration, testChallengeValidation, testJWTValidation };
