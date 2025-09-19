export const config = {
  HORIZON_URL: process.env.STELLAR_HORIZON_URL || process.env.HORIZON_URL || 'https://horizon.stellar.org',
  NETWORK_PASSPHRASE: process.env.STELLAR_NETWORK_PASSPHRASE || 'Public Global Stellar Network ; September 2015',
  SOROBAN_URL: process.env.SOROBAN_RPC_URL || 'https://mainnet.sorobanrpc.com',

  CODY_ASSET_CODE: process.env.CODY_ASSET_CODE || 'CODY',
  CODY_ISSUER: process.env.CODY_ISSUER || '',
  USDC_ISSUER: process.env.USDC_ISSUER || '',

  CODY_TOKEN_CONTRACT: process.env.CODY_TOKEN_CONTRACT || '',
  USDC_TOKEN_CONTRACT: process.env.USDC_TOKEN_CONTRACT || '',
  AQUA_TOKEN_CONTRACT: process.env.AQUA_TOKEN_CONTRACT || '',
  AQUA_POOL_CONTRACT: process.env.AQUA_POOL_CONTRACT || '',
} as const;

export function isPubKey(x?: string) {
  return !!x && x.length === 56 && x.startsWith('G');
}

export function validateConfig(strict = false) {
  if (!isPubKey(config.CODY_ISSUER)) {
    if (strict) throw new Error('Invalid CODY_ISSUER');
    console.warn('Invalid or missing CODY_ISSUER in environment');
  }
  if (config.USDC_ISSUER && !isPubKey(config.USDC_ISSUER)) {
    if (strict) throw new Error('Invalid USDC_ISSUER');
    console.warn('Invalid USDC_ISSUER format in environment');
  }
}
