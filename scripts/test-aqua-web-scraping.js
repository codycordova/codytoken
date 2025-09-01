#!/usr/bin/env node

/**
 * Test script to check Aqua web page scraping
 */

const POOL_URLS = {
  CODY_USDC: 'https://aqua.network/pools/CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU/',
  CODY_XLM: 'https://aqua.network/pools/CAOBPWLHSERILJTLOH4APQU3AXUGQBOKLWDEM64A4AZG6XFSZHBEREDW/',
  CODY_AQUA: 'https://aqua.network/pools/CDCT6W2XW64ZCIUEMRG46CJVE734SZDL6WDEH2QQOABBNU2XUSCTQEMR/'
};

async function testWebScraping() {
  console.log('🔍 Testing Aqua Web Page Scraping');
  console.log('=' .repeat(60));
  
  for (const [poolName, poolUrl] of Object.entries(POOL_URLS)) {
    try {
      console.log(`\n🧪 Testing ${poolName}...`);
      console.log(`📍 URL: ${poolUrl}`);
      
      const response = await fetch(poolUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      console.log(`✅ Status: ${response.status}`);
      
      if (response.ok) {
        const html = await response.text();
        console.log(`📊 HTML Length: ${html.length} characters`);
        
        // Look for price patterns
        const pricePatterns = [
          /(\d+\.?\d*)\s*(?:XLM|USD|USDC)/gi,
          /price[:\s]*(\d+\.?\d*)/gi,
          /(\d+\.?\d*)\s*per\s*CODY/gi
        ];
        
        let foundPrices = [];
        for (const pattern of pricePatterns) {
          const matches = html.match(pattern);
          if (matches) {
            foundPrices.push(...matches);
          }
        }
        
        if (foundPrices.length > 0) {
          console.log(`💰 Found price patterns:`, foundPrices.slice(0, 5));
        } else {
          console.log(`❌ No price patterns found`);
        }
        
        // Look for TVL patterns
        const tvlPatterns = [
          /TVL[:\s]*\$?([\d,]+\.?\d*)/gi,
          /total.*value.*locked[:\s]*\$?([\d,]+\.?\d*)/gi
        ];
        
        let foundTVL = [];
        for (const pattern of tvlPatterns) {
          const matches = html.match(pattern);
          if (matches) {
            foundTVL.push(...matches);
          }
        }
        
        if (foundTVL.length > 0) {
          console.log(`💎 Found TVL patterns:`, foundTVL.slice(0, 3));
        } else {
          console.log(`❌ No TVL patterns found`);
        }
        
        // Look for volume patterns
        const volumePatterns = [
          /24h[:\s]*\$?([\d,]+\.?\d*)/gi,
          /volume[:\s]*\$?([\d,]+\.?\d*)/gi
        ];
        
        let foundVolume = [];
        for (const pattern of volumePatterns) {
          const matches = html.match(pattern);
          if (matches) {
            foundVolume.push(...matches);
          }
        }
        
        if (foundVolume.length > 0) {
          console.log(`📈 Found volume patterns:`, foundVolume.slice(0, 3));
        } else {
          console.log(`❌ No volume patterns found`);
        }
        
      } else {
        console.log(`❌ Failed to fetch page`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing ${poolName}:`, error.message);
    }
  }
}

testWebScraping().catch(console.error);
