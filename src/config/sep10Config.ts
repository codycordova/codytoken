/**
 * SEP-10 Configuration
 * 
 * Required Environment Variables:
 * - JWT_SECRET: Secret key for JWT token signing (change in production!)
 * - DOMAIN: Your domain for SEP-10 authentication (e.g., api.codytoken.com)
 * 
 * Optional Environment Variables:
 * - STELLAR_NETWORK: Stellar network (default: public)
 * - HORIZON_URL: Stellar Horizon server URL (default: https://horizon.stellar.org)
 */

// Validate required environment variables
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET;
const DOMAIN = process.env.DOMAIN;

// Function to validate configuration at runtime
function validateConfig() {
  if (NODE_ENV === 'production') {
    if (!JWT_SECRET || JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET environment variable is required in production and must be at least 32 characters long');
    }
    if (!DOMAIN) {
      throw new Error('DOMAIN environment variable is required in production');
    }
  }
}

export const SEP10_CONFIG = {
  JWT_SECRET: JWT_SECRET || (NODE_ENV === 'development' ? 'dev-secret-key-not-for-production-use-only' : ''),
  DOMAIN: DOMAIN || (NODE_ENV === 'development' ? 'localhost:3000' : ''),
  STELLAR_NETWORK: process.env.STELLAR_NETWORK || 'public',
  HORIZON_URL: process.env.HORIZON_URL || 'https://horizon.stellar.org',
  NODE_ENV: NODE_ENV,
  validate: validateConfig
};
