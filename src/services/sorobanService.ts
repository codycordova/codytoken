/* eslint-disable @typescript-eslint/no-explicit-any */
import * as StellarSdk from '@stellar/stellar-sdk';
const { Account, BASE_FEE, Contract, Keypair, Networks, TransactionBuilder, scValToNative } = StellarSdk as any;

const DEFAULT_SOROBAN_RPC = process.env.SOROBAN_RPC_URL || 'https://mainnet.sorobanrpc.com';
const NETWORK_PASSPHRASE = process.env.STELLAR_NETWORK_PASSPHRASE || Networks.PUBLIC;

async function simulateRead(contractId: string, method: string, args: any[] = []): Promise<any | null> {
  try {
    const server = new (StellarSdk as any).SorobanRpc.Server(DEFAULT_SOROBAN_RPC, { allowHttp: DEFAULT_SOROBAN_RPC.startsWith('http://') });
    const sourceKP = Keypair.random();
    const source = new Account(sourceKP.publicKey(), '0');
    const contract = new Contract(contractId);

    let tx = new TransactionBuilder(source, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    // Prepare & simulate
    tx = await server.prepareTransaction(tx);
    const sim = await server.simulateTransaction(tx);
    if (!sim || sim.status !== 'SUCCESS' || !sim.result) return null;

    const retval = (sim.result as any).retval as any | undefined;
    if (!retval) return null;

    return scValToNative(retval);
  } catch {
    return null;
  }
}

export async function tryPoolReservesFromSoroban(poolContractId: string, codyContractId?: string) {
  // Try common method names
  const candidates = ['get_reserves', 'get_rsrvs', 'get_info', 'pool_info'];
  for (const method of candidates) {
    const result = await simulateRead(poolContractId, method);
    if (!result) continue;

    // Normalize result
    // Expected shapes (examples):
    // - { asset_a_amount: i128, asset_b_amount: i128, asset_a: Address, asset_b: Address }
    // - { reserve_a: i128, reserve_b: i128, token_a: Address, token_b: Address }
    // - [amountA, amountB]
    try {
      let amountA: number | null = null;
      let amountB: number | null = null;
      let tokenA: string | undefined;
      let tokenB: string | undefined;

      if (Array.isArray(result) && result.length >= 2) {
        amountA = Number(result[0]);
        amountB = Number(result[1]);
      } else if (typeof result === 'object') {
        const obj = result as Record<string, any>;
        amountA = obj.asset_a_amount ?? obj.reserve_a ?? obj.amount_a ?? obj.a ?? null;
        amountB = obj.asset_b_amount ?? obj.reserve_b ?? obj.amount_b ?? obj.b ?? null;
        tokenA = obj.asset_a ?? obj.token_a ?? obj.a_token ?? obj.tokenA;
        tokenB = obj.asset_b ?? obj.token_b ?? obj.b_token ?? obj.tokenB;
        if (amountA !== null) amountA = Number(amountA);
        if (amountB !== null) amountB = Number(amountB);
      }

      if (amountA === null || amountB === null) continue;

      // Decide which side is CODY if contract IDs provided
      let codyRaw: number = amountA;
      let counterRaw: number = amountB;
      if (codyContractId && (tokenA || tokenB)) {
        const tA = (tokenA || '').toString();
        const tB = (tokenB || '').toString();
        if (tA.includes(codyContractId)) {
          codyRaw = amountA!;
          counterRaw = amountB!;
        } else if (tB.includes(codyContractId)) {
          codyRaw = amountB!;
          counterRaw = amountA!;
        }
      }

      return {
        codyRaw,
        counterRaw
      };
    } catch {
      // Try next method
    }
  }
  return null;
}

export async function getTokenDecimals(contractId: string): Promise<number | null> {
  const result = await simulateRead(contractId, 'decimals');
  if (result === null || result === undefined) return null;
  const n = Number(result);
  return Number.isFinite(n) ? n : null;
}


