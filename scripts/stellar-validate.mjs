#!/usr/bin/env node

import { Keypair } from '@stellar/stellar-sdk';

function isGAddress(value) {
  return typeof value === 'string' && /^G[A-Z2-7]{55}$/.test(value);
}

function isSSecret(value) {
  return typeof value === 'string' && /^S[A-Z2-7]{55}$/.test(value);
}

function fail(message) {
  console.error(`✖ ${message}`);
  return false;
}

function warn(message) {
  console.warn(`! ${message}`);
}

function ok(message) {
  console.log(`✔ ${message}`);
}

(async function main() {
  const env = process.env;
  let passed = true;

  // Strict in CI or production, opt-in via STELLAR_VALIDATE_STRICT=1; non-strict for local dev by default
  const NODE_ENV = env.NODE_ENV || 'development';
  const STRICT =
    env.STELLAR_VALIDATE_STRICT === '1' ||
    env.CI === 'true' ||
    NODE_ENV === 'production';

  const DOMAIN = env.DOMAIN;
  const HOME_DOMAIN = env.HOME_DOMAIN;
  const JWT_SECRET = env.JWT_SECRET || '';
  const STELLAR_NETWORK = (env.STELLAR_NETWORK || 'public').toLowerCase();
  const CODY_ISSUER = env.CODY_ISSUER || 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK';

  const err = (message) => {
    if (STRICT) {
      passed = fail(message) && passed;
    } else {
      warn(`${message} — ignoring in non-strict mode`);
    }
  };

  console.log(`Stellar validate mode: ${STRICT ? 'strict' : 'non-strict (local)'}`);

  // Validate base config
  if (JWT_SECRET.length < 32) err('JWT_SECRET must be set and at least 32 characters long');
  if (!DOMAIN) err('DOMAIN must be set (e.g., api.example.com)');
  if (!HOME_DOMAIN) err('HOME_DOMAIN must be set (e.g., example.com)');
  if (STRICT) {
    if (DOMAIN && DOMAIN.includes('localhost')) err('DOMAIN must not be localhost in production');
    if (HOME_DOMAIN && HOME_DOMAIN.includes('localhost')) err('HOME_DOMAIN must not be localhost in production');
  }
  if (!['public', 'testnet'].includes(STELLAR_NETWORK)) err('STELLAR_NETWORK must be "public" or "testnet"');

  // Derive signing key
  let signingPublicKey = env.SIGNING_KEY || '';
  if (isSSecret(env.WEB_AUTH_SIGNING_SECRET || '')) {
    try {
      signingPublicKey = Keypair.fromSecret(env.WEB_AUTH_SIGNING_SECRET).publicKey();
      ok('Derived SIGNING_KEY from WEB_AUTH_SIGNING_SECRET');
    } catch (e) {
      err('WEB_AUTH_SIGNING_SECRET is invalid');
    }
  }
  if (!isGAddress(signingPublicKey)) err('SIGNING_KEY must be a valid G... public key (or provide WEB_AUTH_SIGNING_SECRET)');

  // Accounts
  const accounts = [
    signingPublicKey,
    env.TREASURY_ACCOUNT,
    env.OPS_ACCOUNT_1,
    env.OPS_ACCOUNT_2,
    CODY_ISSUER
  ].filter(Boolean);

  for (let i = 0; i < accounts.length; i++) {
    if (!isGAddress(accounts[i])) err(`Account #${i + 1} is not a valid G-address`);
  }
  if (!accounts.includes(signingPublicKey)) err('ACCOUNTS must include SIGNING_KEY');
  if (!accounts.includes(CODY_ISSUER)) err('ACCOUNTS must include CODY_ISSUER');

  // Compute values for TOML
  const networkPassphrase = STELLAR_NETWORK === 'testnet'
    ? 'Test SDF Network ; September 2015'
    : 'Public Global Stellar Network ; September 2015';

  const webAuthEndpoint = DOMAIN ? `https://${DOMAIN}/api/sep10` : '';

  // TOML preview (mirrors the app route)
  const toml = `VERSION = "2.7.0"
NETWORK_PASSPHRASE = "${networkPassphrase}"

# Dedicated signing key for domain/SEP-10
SIGNING_KEY = "${signingPublicKey}"

ACCOUNTS = [
${accounts.map(a => isGAddress(a) ? `  "${a}"` : '  "[REDACTED]"').join(',\n')}
]

WEB_AUTH_ENDPOINT = "${webAuthEndpoint}"
`;

  // Simple TOML checks
  if (!webAuthEndpoint) err('WEB_AUTH_ENDPOINT could not be derived (missing DOMAIN)');
  if (!toml.includes(signingPublicKey)) err('TOML preview missing SIGNING_KEY');

  // Output summary
  console.log('--- TOML Preview (partial) ---');
  console.log(toml);
  console.log('-------------------------------');

  if (STRICT && !passed) {
    console.error('Stellar validation failed. See errors above.');
    process.exit(1);
  } else {
    if (STRICT) {
      ok('Stellar validation passed');
    } else {
      ok('Stellar validation warnings ignored in non-strict mode');
    }
  }
})();
