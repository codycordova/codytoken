'use client';

import React, { useMemo, useState } from 'react';
import {
  Asset,
  TransactionBuilder,
  Networks,
  Operation,
} from '@stellar/stellar-sdk';
import { Horizon } from '@stellar/stellar-sdk';
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit';

const HORIZON_URL = 'https://horizon.stellar.org';
const STROOPS_PER_XLM = 10_000_000;

// CODY asset
const CODY = new Asset(
  'CODY',
  'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK'
);

// Stellar SDK type definitions
interface StellarPathAsset {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
}

interface StellarBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

interface StellarAccount {
  balances: StellarBalance[];
  subentry_count?: string;
}

interface StellarPathRecord {
  destination_amount: string;
  path: StellarPathAsset[];
}

interface StellarPathsResponse {
  records: StellarPathRecord[];
}

interface StellarError {
  response?: {
    data?: {
      extras?: {
        result_codes?: {
          operations?: string[];
        };
      };
    };
  };
  message?: string;
}

type Props = {
  walletAddress?: string;
};

export default function AtomicSwapCard({ walletAddress }: Props) {
  // UI state
  const [xlmAmount, setXlmAmount] = useState<string>('5');
  const [slippagePct, setSlippagePct] = useState<number>(1);  // 0.5–3%
  const [status, setStatus] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);

  // Quote/result display
  const [routeStr, setRouteStr] = useState<string>('—');
  const [impliedRate, setImpliedRate] = useState<string>('—'); // CODY per XLM
  const [minReceived, setMinReceived] = useState<string>('—'); // CODY min (destMin)
  const [estReceived, setEstReceived] = useState<string>('—'); // CODY estimate
  const [priceImpact, setPriceImpact] = useState<string>('—'); // approx %

  const server = useMemo(() => new Horizon.Server(HORIZON_URL), []);
  // Local kit instance; we don’t show any wallet selector here.
  const kit = useMemo(
    () =>
      new StellarWalletsKit({
        network: WalletNetwork.PUBLIC,
        modules: allowAllModules(),
      }),
    []
  );

  // Helpers
  function toSdkAssets(pathArr: StellarPathAsset[]) {
    return pathArr.map((p: StellarPathAsset) =>
      p.asset_type === 'native' ? Asset.native() : new Asset(p.asset_code!, p.asset_issuer!)
    );
  }

  function formatAssetLabel(p: StellarPathAsset): string {
    if (p.asset_type === 'native') return 'XLM';
    const code = p.asset_code || 'UNKNOWN';
    const iss = (p.asset_issuer || '').slice(0, 4) + '…' + (p.asset_issuer || '').slice(-4);
    return `${code}(${iss})`;
  }

  function hasCodyTrustline(account: StellarAccount) {
    return account.balances?.some(
      (b: StellarBalance) => b.asset_code === 'CODY' && b.asset_issuer === CODY.getIssuer()
    );
  }

  async function fetchBaseReserveXLM(): Promise<number> {
    const ledgers = await server.ledgers().order('desc').limit(1).call();
    const baseReserveStroops = Number(ledgers.records[0].base_reserve_in_stroops);
    return baseReserveStroops / STROOPS_PER_XLM; // XLM
  }

  // Make sure the kit knows which wallet to use.
  // We try Freighter automatically if it's installed; otherwise, if nothing is set,
  // we’ll throw a helpful message telling the user to connect in the header.
  async function ensureWalletModuleSelected() {
    try {
      await kit.getAddress(); // if this works, a wallet is already set
      return;
    } catch {
      // Try Freighter automatically if present
      if (typeof window !== 'undefined' && (window as unknown as { freighterApi?: unknown }).freighterApi) {
        await kit.setWallet('freighter'); // id used by StellarWalletsKit for Freighter
        return;
      }
      // Nothing selected in this local kit:
      throw new Error('No wallet module selected. Please connect your wallet in the header first.');
    }
  }

  async function signWithConnectedWallet(xdr: string, address: string): Promise<string> {
    await ensureWalletModuleSelected();
    const { signedTxXdr } = await kit.signTransaction(xdr, {
      address,
      networkPassphrase: WalletNetwork.PUBLIC,
    });
    return signedTxXdr;
  }

  async function handleSwap() {
    try {
      if (!walletAddress) {
        setStatus('Please connect your wallet in the header first.');
        return;
      }
      if (!xlmAmount || Number(xlmAmount) <= 0) {
        setStatus('Enter a positive XLM amount.');
        return;
      }
      if (slippagePct < 0.5 || slippagePct > 3) {
        setStatus('Slippage must be between 0.5% and 3%.');
        return;
      }

      setBusy(true);
      setStatus('Quoting path XLM → CODY…');

      // 1) Quote strict-send paths (XLM -> CODY)
      const paths = await server.strictSendPaths(Asset.native(), String(xlmAmount), [CODY]).call() as StellarPathsResponse;
      if (!paths.records.length) {
        setStatus('No viable path (liquidity too low). Try a smaller amount.');
        return;
      }

      // Pick the best (largest destination_amount)
      const best = [...paths.records].sort(
        (a, b) => Number(b.destination_amount) - Number(a.destination_amount)
      )[0];

      // UI: route + implied rate + estimate
      const fullRoute = ['XLM', ...best.path.map(formatAssetLabel), 'CODY'].join(' → ');
      setRouteStr(fullRoute);

      const destAmountNum = Number(best.destination_amount);
      const rate = destAmountNum / Number(xlmAmount);
      setImpliedRate(`${rate.toFixed(7)} CODY/XLM`);
      setEstReceived(`${destAmountNum.toFixed(7)} CODY`);

      // 2) Approx. price impact vs 1 XLM quote
      try {
        const small = await server.strictSendPaths(Asset.native(), '1', [CODY]).call() as StellarPathsResponse;
        if (small.records.length) {
          const smallBest = [...small.records].sort(
            (a, b) => Number(b.destination_amount) - Number(a.destination_amount)
          )[0];
          const smallRate = Number(smallBest.destination_amount);
          const impact = Math.max(0, 1 - rate / smallRate) * 100;
          setPriceImpact(`≈ ${impact.toFixed(2)}%`);
        } else {
          setPriceImpact('—');
        }
      } catch {
        setPriceImpact('—');
      }

      // 3) destMin with user slippage
      const destMinNum = destAmountNum * (1 - slippagePct / 100);
      const destMin = destMinNum.toFixed(7);
      setMinReceived(`${destMin} CODY`);

      const pathAssets = toSdkAssets(best.path);

      // 4) Load account + reserve check for new trustline
      setStatus('Checking account + reserve…');
      const account = await server.loadAccount(walletAddress);
      const needTrustline = !hasCodyTrustline(account as unknown as StellarAccount);

      if (needTrustline) {
        const nativeBal = Number(
          ((account as unknown as StellarAccount).balances.find((b: StellarBalance) => b.asset_type === 'native')?.balance as string) || '0'
        );
        const baseReserve = await fetchBaseReserveXLM(); // live value
        const currentMin = (2 + Number(account.subentry_count || 0)) * baseReserve;
        const available = nativeBal - currentMin;
        const requiredExtra = baseReserve; // one more subentry (trustline)
        const feeBuffer = 0.001;

        if (available < requiredExtra + feeBuffer) {
          const short = requiredExtra + feeBuffer - available;
          setStatus(
            `Insufficient reserve to add a trustline. You need about ${short.toFixed(6)} more XLM free.`
          );
          return;
        }
      }

      // 5) Build multi-op tx
      const baseFee = await server.fetchBaseFee();
      let tb = new TransactionBuilder(account, {
        fee: String(baseFee),
        networkPassphrase: Networks.PUBLIC,
      });

      if (needTrustline) {
        tb = tb.addOperation(Operation.changeTrust({ asset: CODY }));
      }

      tb = tb.addOperation(
        Operation.pathPaymentStrictSend({
          sendAsset: Asset.native(),
          sendAmount: String(xlmAmount),
          destination: walletAddress,
          destAsset: CODY,
          destMin,
          path: pathAssets,
        })
      );

      const tx = tb.setTimeout(180).build();

      // 6) Sign + submit
      setStatus('Requesting signature from your connected wallet…');
      const signedXdr = await signWithConnectedWallet(tx.toXDR(), walletAddress);
      const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.PUBLIC);

      setStatus('Submitting transaction…');
      const res = await server.submitTransaction(signedTx);
      setStatus(`✅ Swap complete! Hash: ${res.hash}`);
    } catch (err: unknown) {
      console.error(err);
      const stellarErr = err as StellarError;
      const opCodes = stellarErr?.response?.data?.extras?.result_codes?.operations;
      const msg =
        opCodes ||
        stellarErr?.message ||
        'Unknown error. If your wallet is connected, ensure it’s allowed to sign in this tab.';
      setStatus(`❌ Error: ${msg}`);
    } finally {
      setBusy(false);
    }
  }

  const signerRow = walletAddress
    ? walletAddress.slice(0, 6) + '…' + walletAddress.slice(-6)
    : 'Not connected';

  const swapDisabled = busy || !walletAddress;

  return (
    <section
      style={{
        marginTop: '2rem',
        background: 'rgba(22,22,40,0.85)',
        border: '1px solid rgba(127,156,245,0.35)',
        borderRadius: 16,
        padding: '1.25rem',
        boxShadow: '0 2px 16px rgba(127,156,245,0.25)',
      }}
    >
      <h2 style={{ margin: 0, marginBottom: 8 }}>Swap XLM → CODY (one signature, atomic)</h2>

      {/* Signer (from global connect) */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 14, opacity: 0.9 }}>Signer:</div>
        <code style={{ fontSize: 13 }}>{signerRow}</code>
        <div style={{ flex: 1 }} />
      </div>

      {/* Amount input */}
      <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>
        XLM to spend
      </label>
      <input
        type="number"
        value={xlmAmount}
        min="0"
        step="0.0000001"
        onChange={(e) => setXlmAmount(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid rgba(127,156,245,0.4)',
          background: 'rgba(15,15,28,0.9)',
          color: '#e0e7ff',
          marginBottom: 12,
        }}
        placeholder="e.g. 5"
      />

      {/* Slippage input */}
      <label style={{ display: 'block', fontSize: 14, margin: '6px 0' }}>
        Slippage tolerance (%)
      </label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="number"
          min={0.5}
          max={3}
          step={0.1}
          value={slippagePct}
          onChange={(e) => setSlippagePct(Number(e.target.value))}
          style={{
            width: 120,
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid rgba(127,156,245,0.4)',
            background: 'rgba(15,15,28,0.9)',
            color: '#e0e7ff',
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {[0.5, 1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setSlippagePct(p)}
              style={{
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid rgba(127,156,245,0.25)',
                background: p === slippagePct ? '#7f9cf5' : 'rgba(15,15,28,0.9)',
                color: p === slippagePct ? '#0b0b16' : '#e0e7ff',
                cursor: 'pointer',
              }}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSwap}
        disabled={swapDisabled}
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          border: 'none',
          background: swapDisabled ? 'rgba(127,156,245,0.45)' : '#7f9cf5',
          color: '#0b0b16',
          fontWeight: 700,
          cursor: swapDisabled ? 'not-allowed' : 'pointer',
        }}
        title={!walletAddress ? 'Connect your wallet in the header to enable swap' : undefined}
      >
        {busy ? 'Working…' : 'Swap XLM → CODY'}
      </button>

      {/* Live quote details */}
      <div
        style={{
          marginTop: 12,
          padding: '10px 12px',
          borderRadius: 12,
          background: 'rgba(15,15,28,0.65)',
          border: '1px solid rgba(127,156,245,0.2)',
          color: '#cbd5ff',
          fontSize: 13,
        }}
      >
        <div><b>Route:</b> {routeStr}</div>
        <div><b>Implied rate:</b> {impliedRate}</div>
        <div><b>Estimated received:</b> {estReceived}</div>
        <div><b>Minimum received (slippage {slippagePct}%):</b> {minReceived}</div>
        <div><b>Approx. price impact:</b> {priceImpact}</div>
      </div>

      <p
        style={{
          marginTop: 12,
          fontFamily: 'monospace',
          fontSize: 13,
          whiteSpace: 'pre-wrap',
          color: '#cbd5ff',
        }}
      >
        {status}
      </p>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
        • If you don’t have a CODY trustline, we add it first (this raises your minimum reserve by ~1× the base reserve).<br />
        • Path is auto-routed; you don’t need trustlines for intermediate assets.<br />
        • The whole swap is atomic: if any operation fails, nothing is applied.
      </div>
    </section>
  );
}
