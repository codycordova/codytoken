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

export const SEP10_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  DOMAIN: process.env.DOMAIN || 'api.codytoken.com',
  STELLAR_NETWORK: process.env.STELLAR_NETWORK || 'public',
  HORIZON_URL: process.env.HORIZON_URL || 'https://horizon.stellar.org',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Validation
if (SEP10_CONFIG.JWT_SECRET === 'your-secret-key-change-in-production' && SEP10_CONFIG.NODE_ENV === 'production') {
  console.warn('⚠️  WARNING: Using default JWT secret in production! Please set JWT_SECRET environment variable.');
}

if (!SEP10_CONFIG.DOMAIN || SEP10_CONFIG.DOMAIN === 'api.codytoken.com') {
  console.warn('⚠️  WARNING: Using default domain. Please set DOMAIN environment variable for your deployment.');
}
