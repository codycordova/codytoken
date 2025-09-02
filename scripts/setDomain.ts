import * as SDK from '@stellar/stellar-sdk';
import { Networks, TransactionBuilder } from '@stellar/stellar-sdk';
import { SorobanDomainsSDK, DefaultStorageKeys } from '@creit.tech/sorobandomains-sdk';
import { CONFIG } from './config';

const rpc = new SDK.rpc.Server(CONFIG.RPC_URL);

const sd = new SorobanDomainsSDK({
  stellarSDK: SDK,
  rpc,
  network:
    CONFIG.NETWORK_PASSPHRASE.includes("Public")
      ? Networks.PUBLIC
      : Networks.TESTNET,
  valuesDatabaseContractId: CONFIG.VALUES_DB_CONTRACT_ID,
  defaultFee: '200000',
  defaultTimeout: 120,
  simulationAccount: CONFIG.OWNER_PUBLIC,
});

async function main() {
  const op = await sd.setDomainData({
    node: CONFIG.DOMAIN_LABEL,
    key: DefaultStorageKeys.TOML,
    value: ['String', CONFIG.TOML_URL],
    source: CONFIG.OWNER_PUBLIC,
  });

  let signedXDR: string;
  if (CONFIG.OWNER_SECRET) {
    const kp = SDK.Keypair.fromSecret(CONFIG.OWNER_SECRET);
    op.tx.sign(kp);
    signedXDR = op.tx.toXDR();
  } else {
    const unsignedXDR = op.tx.toXDR();
    console.log('\n=== COPY THIS UNSIGNED XDR AND SIGN IT WITH xBull (or your wallet) ===\n');
    console.log(unsignedXDR);
    console.log('\nIn xBull: open the wallet, use "Sign XDR", paste the XDR, sign, then copy the SIGNED XDR here.');
    console.log('Paste the SIGNED XDR below and press Enter:\n');
    signedXDR = await new Promise<string>((resolve) => {
      process.stdin.setEncoding('utf8');
      process.stdin.once('data', (data) => resolve(data.toString().trim()));
    });
  }

  const tx = TransactionBuilder.fromXDR(signedXDR, CONFIG.NETWORK_PASSPHRASE);
  const send = await rpc.sendTransaction(tx);
  console.log('sendTransaction ->', send);
  if (send.status !== 'PENDING') return;

  let tries = 0;
  while (tries++ < 20) {
    await new Promise(r => setTimeout(r, 1500));
    const got = await rpc.getTransaction(send.hash);
    if (got.status === 'SUCCESS') { console.log('✅ Success!', got); break; }
    if (got.status === 'FAILED')  { console.error('❌ Failed:', got); break; }
    process.stdout.write('.');
  }

  const readBack = await sd.getDomainData({ node: CONFIG.DOMAIN_LABEL, key: DefaultStorageKeys.TOML });
  console.log('\nRead-back TOML value:', readBack);
}

main().catch((e) => { console.error(e); process.exit(1); });
