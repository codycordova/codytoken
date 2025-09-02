import 'dotenv/config';
import { Networks } from '@stellar/stellar-sdk';
// Import the built file with an explicit extension to avoid ESM specifier issues seen earlier.
import { SorobanDomainsSDK } from '@creit.tech/sorobandomains-sdk/build/sdk.js';

// ---- Configuration (env + sane defaults) ----
const CONTRACT_ID = process.env.SOROBAN_DOMAINS_CONTRACT_ID as string; // e.g. CDH2T2C...
const ADMIN_SECRET = process.env.SOROBAN_ADMIN_SECRET as string; // Must be the admin/authorized key
const HORIZON_URL = process.env.HORIZON_URL || 'https://horizon.stellar.org';
const RPC_URL = process.env.SOROBAN_RPC_URL || 'https://rpc.stellar.org:443'; // Update if using testnet
const NETWORK_PASSPHRASE =
    process.env.NETWORK_PASSPHRASE || Networks.PUBLIC; // Use Networks.TESTNET for testnet

// Domain and TOML URL to set
const DOMAIN_NAME = process.env.DOMAIN_NAME || 'codytoken.com';
const TOML_URL =
    process.env.TOML_URL || 'https://codytoken.com/.well-known/stellar.toml';

// ---- Validation helpers ----
function assertNonEmpty(name: string, value: string | undefined | null): asserts value is string {
    if (!value || !value.trim()) {
        throw new Error(`Missing required configuration: ${name}`);
    }
}

function validateInputs() {
    assertNonEmpty('SOROBAN_DOMAINS_CONTRACT_ID', CONTRACT_ID);
    assertNonEmpty('SOROBAN_ADMIN_SECRET', ADMIN_SECRET);
    assertNonEmpty('HORIZON_URL', HORIZON_URL);
    assertNonEmpty('SOROBAN_RPC_URL', RPC_URL);
    assertNonEmpty('NETWORK_PASSPHRASE', NETWORK_PASSPHRASE);
    assertNonEmpty('DOMAIN_NAME', DOMAIN_NAME);
    assertNonEmpty('TOML_URL', TOML_URL);

    if (!/^https?:\/\//i.test(TOML_URL)) {
        throw new Error(`TOML_URL must be http(s): ${TOML_URL}`);
    }
}

// ---- Main action ----
async function setTomlRecord() {
    validateInputs();

    // Log the exact payload so issues are easy to spot
    console.log('Preparing to set domain record:');
    console.table({
        contractId: CONTRACT_ID,
        domain: DOMAIN_NAME,
        recordType: 'TOML',
        url: TOML_URL,
        network: NETWORK_PASSPHRASE.includes('Public') ? 'PUBLIC' : 'TESTNET/OTHER',
        rpc: RPC_URL,
        horizon: HORIZON_URL,
    });

    // Initialize SDK
    // Cast to any to bridge mismatched type definitions vs. runtime shape (adminSecret is used by runtime).
    const sdk = new SorobanDomainsSDK({
        contractId: CONTRACT_ID,
        adminSecret: ADMIN_SECRET,
        horizonUrl: HORIZON_URL,
        rpcUrl: RPC_URL,
        networkPassphrase: NETWORK_PASSPHRASE,
    } as any);

    // Use the string literal instead of a missing enum export
    const recordType = 'TOML' as const;

    try {
        // Cast args to any to satisfy stricter .d.ts union types. Runtime accepts string for value.
        const txResult = await (sdk as any).setDomainData({
            domain: DOMAIN_NAME,
            type: recordType,
            value: TOML_URL,
        } as any);

        console.log('Success: domain data set.');
        console.dir(txResult, { depth: null });
    } catch (err: any) {
        console.error('Failed to set domain data.');
        console.error('Context:', {
            contractId: CONTRACT_ID,
            domain: DOMAIN_NAME,
            type: 'TOML',
            value: TOML_URL,
        });
        console.error('Error:', err?.message || err);
        if (err?.response?.data) {
            console.error('RPC response data:', err.response.data);
        }
        process.exit(1);
    }
}

async function main() {
    await setTomlRecord();
}

main().catch((e) => {
    console.error('Unexpected error:', e);
    process.exit(1);
});