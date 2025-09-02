import 'dotenv/config';

export const CONFIG = {
  RPC_URL: process.env.RPC_URL!,
  NETWORK_PASSPHRASE: process.env.NETWORK_PASSPHRASE!,
  REGISTRY_CONTRACT_ID: process.env.REGISTRY_CONTRACT_ID!,
  VALUES_DB_CONTRACT_ID: process.env.VALUES_DB_CONTRACT_ID!,
  DOMAIN_LABEL: process.env.DOMAIN_LABEL || 'cody',
  TOML_URL: process.env.TOML_URL!,
  OWNER_PUBLIC: process.env.DOMAIN_OWNER_PUBLIC!,
  OWNER_SECRET: process.env.DOMAIN_OWNER_SECRET || '',
};

if (!CONFIG.RPC_URL || !CONFIG.NETWORK_PASSPHRASE || !CONFIG.VALUES_DB_CONTRACT_ID || !CONFIG.TOML_URL || !CONFIG.OWNER_PUBLIC) {
  throw new Error('Missing required env vars in .env');
}
