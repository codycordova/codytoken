/**
 * SEP-10 Configuration
 * 
 * Required Environment Variables:
 * - JWT_SECRET: Secret key for JWT token signing (change in production!)
 * - DOMAIN: Your API domain for SEP-10 auth (e.g., api.codytoken.com)
 * - WEB_AUTH_SIGNING_SECRET: Stellar secret seed (S...) for server signing key
 * - HOME_DOMAIN: Your home domain used in challenge (e.g., codytoken.com)
 * 
 * Optional Environment Variables:
 * - STELLAR_NETWORK: Stellar network (default: public)
 * - HORIZON_URL: Stellar Horizon server URL (default: https://horizon.stellar.org)
 */

// Validate required environment variables
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET;
const DOMAIN = process.env.DOMAIN;
const WEB_AUTH_SIGNING_SECRET = process.env.WEB_AUTH_SIGNING_SECRET;
const HOME_DOMAIN = process.env.HOME_DOMAIN;

// Function to validate configuration at runtime
function validateConfig() {
  if (NODE_ENV === 'production') {
    const errors: string[] = [];
    
    if (!JWT_SECRET || JWT_SECRET.length < 32) {
      errors.push('JWT_SECRET environment variable is required in production and must be at least 32 characters long');
    }
    
    if (!DOMAIN) {
      errors.push('DOMAIN environment variable is required in production');
    }
    if (!WEB_AUTH_SIGNING_SECRET || !/^S[A-Z2-7]{55}$/.test(WEB_AUTH_SIGNING_SECRET)) {
      errors.push('WEB_AUTH_SIGNING_SECRET (Stellar secret seed) is required in production and must be valid');
    }
    if (!HOME_DOMAIN) {
      errors.push('HOME_DOMAIN environment variable is required in production');
    }
    
    // Check for common security issues
    if (JWT_SECRET && JWT_SECRET.includes('dev-secret')) {
      errors.push('JWT_SECRET appears to be a development secret - use a secure production secret');
    }
    
    if (DOMAIN && DOMAIN.includes('localhost')) {
      errors.push('DOMAIN should not contain localhost in production');
    }
    
    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.map(e => `- ${e}`).join('\n')}\n\nFor production, set secrets using: fly secrets set JWT_SECRET="your-secret" DOMAIN="api.codytoken.com" HOME_DOMAIN="codytoken.com" WEB_AUTH_SIGNING_SECRET="S..."`);
    }
  } else {
    // Development warnings
    if (!JWT_SECRET) {
      console.warn('⚠️  JWT_SECRET not set - using development fallback');
    }
    if (!DOMAIN) {
      console.warn('⚠️  DOMAIN not set - using localhost:3000');
    }
  }
}

export const SEP10_CONFIG = {
  JWT_SECRET: JWT_SECRET || (NODE_ENV === 'development' ? 'dev-secret-key-not-for-production-use-only' : ''),
  DOMAIN: DOMAIN || (NODE_ENV === 'development' ? 'localhost:3000' : ''),
  HOME_DOMAIN: HOME_DOMAIN || (NODE_ENV === 'development' ? 'localhost:3000' : ''),
  WEB_AUTH_SIGNING_SECRET: WEB_AUTH_SIGNING_SECRET || (NODE_ENV === 'development' ? '' : ''),
  STELLAR_NETWORK: process.env.STELLAR_NETWORK || 'public',
  HORIZON_URL: process.env.HORIZON_URL || 'https://horizon.stellar.org',
  NODE_ENV: NODE_ENV,
  validate: validateConfig
};
