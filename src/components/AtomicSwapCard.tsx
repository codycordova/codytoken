/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';


import React, { useMemo, useState, useEffect } from 'react';
import {
  Asset,
  TransactionBuilder,
  Networks,
  Operation,
} from '@stellar/stellar-sdk';
import { Horizon } from '@stellar/stellar-sdk';
import { useStellarWallets } from '@/context/StellarWalletsContext';
import type { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';

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

          transaction?: string;
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

  const [xlmAmount, setXlmAmount] = useState<string>('');
  const [slippagePct, setSlippagePct] = useState<number>(1);
  const [status, setStatus] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [codyBalance, setCodyBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [isLoadingMarketRate, setIsLoadingMarketRate] = useState<boolean>(false);
  const [marketRate, setMarketRate] = useState<number>(0);

  // Quote/result display
  const [routeStr, setRouteStr] = useState<string>('—');

  const [impliedRate, setImpliedRate] = useState<string>('—');
  const [minReceived, setMinReceived] = useState<string>('—');
  const [estReceived, setEstReceived] = useState<string>('—');
  const [priceImpact, setPriceImpact] = useState<string>('—');
  const [showInverseRate, setShowInverseRate] = useState<boolean>(false);

  // Multi-sig detection state
  const [isMultiSig, setIsMultiSig] = useState<boolean>(false);
  const [multiSigSigners, setMultiSigSigners] = useState<Array<{key: string, weight: number}>>([]);

  // Add state for visual feedback
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<boolean>(false);

  const server = useMemo(() => new Horizon.Server(HORIZON_URL), []);
  const { kit } = useStellarWallets();


  // Load wallet balances and detect multi-sig
  useEffect(() => {
    if (!walletAddress) {
      setWalletBalance(0);
      setCodyBalance(0);
      setIsMultiSig(false);
      setMultiSigSigners([]);
      return;
    }

    const loadAccountInfo = async () => {
      setIsLoadingBalance(true);
      try {
        const account = await server.loadAccount(walletAddress);
        
        // Load XLM balance
        const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native');
        const xlmBalance = nativeBalance ? parseFloat(nativeBalance.balance) : 0;
        setWalletBalance(xlmBalance);
        
        // Load CODY balance
        const codyBalanceItem = account.balances.find((b: any) => 
          b.asset_code === 'CODY' && b.asset_issuer === CODY.getIssuer()
        );
        const codyBal = codyBalanceItem ? parseFloat(codyBalanceItem.balance) : 0;
        setCodyBalance(codyBal);

        // Detect multi-sig configuration
        const signers = account.signers || [];
        const totalWeight = signers.reduce((sum: number, signer: any) => sum + signer.weight, 0);
        const threshold = account.thresholds?.med_threshold || 1;
        
        // Check if this is a multi-sig account (multiple signers or high threshold)
        const isMultiSigAccount = signers.length > 1 || totalWeight > threshold;
        
        setIsMultiSig(isMultiSigAccount);
        setMultiSigSigners(signers);
        
        if (isMultiSigAccount) {
          console.log('Multi-sig account detected:', {
            signerCount: signers.length,
            totalWeight,
            threshold,
            signers: signers.map((s: any) => ({ key: s.key, weight: s.weight }))
          });
        }
        
      } catch (error) {
        console.error('Error loading account info:', error);
        setWalletBalance(0);
        setCodyBalance(0);
        setIsMultiSig(false);
        setMultiSigSigners([]);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadAccountInfo();
  }, [walletAddress, server]);

  // Load market rate from CODY price API
  useEffect(() => {
    const loadMarketRate = async () => {
      setIsLoadingMarketRate(true);
      try {
        const response = await fetch('/api/price');
        if (response.ok) {
          const priceData = await response.json();
          setMarketRate(priceData.price.XLM);
        }
      } catch (error) {
        console.error('Error loading market rate:', error);
      } finally {
        setIsLoadingMarketRate(false);
      }
    };

    // Load immediately
    loadMarketRate();

    // Set up polling every 30 seconds for real-time updates
    const intervalId = setInterval(loadMarketRate, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Real-time quote calculation
  useEffect(() => {
    const calculateQuote = async () => {
      if (!walletAddress || !xlmAmount || Number(xlmAmount) <= 0) {
        setEstReceived('0.0000000');
        setImpliedRate('0.0000000');
        setMinReceived('—');
        setPriceImpact('—');
        setRouteStr('—');
        return;
      }

      try {
        // Get quote for the entered amount
        const paths = await server.strictSendPaths(Asset.native(), String(xlmAmount), [CODY]).call() as StellarPathsResponse;
        
        if (!paths.records.length) {
          setEstReceived('0.0000000');
          setImpliedRate('0.0000000');
          setMinReceived('—');
          setPriceImpact('—');
          setRouteStr('No route found');
          return;
        }

        const best = [...paths.records].sort(
          (a, b) => Number(b.destination_amount) - Number(a.destination_amount)
        )[0];

        const destAmountNum = Number(best.destination_amount);
        const rate = destAmountNum / Number(xlmAmount);
        
        // Update UI with real-time data
        setEstReceived(`${destAmountNum.toFixed(7)}`);
        setImpliedRate(`${rate.toFixed(7)}`);
        
        // Calculate minimum received with current slippage
        const destMinNum = destAmountNum * (1 - slippagePct / 100);
        setMinReceived(`${destMinNum.toFixed(7)}`);
        
        // Update route
        const fullRoute = ['XLM', ...best.path.map(formatAssetLabel), 'CODY'].join(' → ');
        setRouteStr(fullRoute);

        // Calculate price impact
        try {
          const small = await server.strictSendPaths(Asset.native(), '1', [CODY]).call() as StellarPathsResponse;
          if (small.records.length) {
            const smallBest = [...small.records].sort(
              (a, b) => Number(b.destination_amount) - Number(a.destination_amount)
            )[0];
            const smallRate = Number(smallBest.destination_amount);
            const impact = Math.max(0, 1 - rate / smallRate) * 100;
            setPriceImpact(`< ${impact.toFixed(1)}%`);
          } else {
            setPriceImpact('—');
          }
        } catch {
          setPriceImpact('—');
        }

      } catch (error) {
        console.error('Error calculating quote:', error);
        setEstReceived('0.0000000');
        setImpliedRate('0.0000000');
        setMinReceived('—');
        setPriceImpact('—');
        setRouteStr('Error getting quote');
      }
    };

    // Debounce the quote calculation to avoid too many API calls
    const timeoutId = setTimeout(calculateQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [xlmAmount, slippagePct, walletAddress, server]);

  // Update minimum received when slippage changes
  useEffect(() => {
    if (estReceived !== '0.0000000' && estReceived !== '—') {
      const estAmount = parseFloat(estReceived);
      if (!isNaN(estAmount)) {
        const destMinNum = estAmount * (1 - slippagePct / 100);
        setMinReceived(`${destMinNum.toFixed(7)}`);
      }
    }
  }, [slippagePct, estReceived]);

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

    return baseReserveStroops / STROOPS_PER_XLM;
  }

  async function ensureWalletModuleSelected(): Promise<StellarWalletsKit> {
    const k = kit;
    if (!k) {
      throw new Error('Wallets are not initialized yet. Please connect your wallet in the header.');
    }

    // Attempt to verify an active wallet selection
    try {
      if (typeof (k as any).getAddress === 'function') {
        await (k as any).getAddress();
        return k;
      }
      if (typeof (k as any).getPublicKey === 'function') {
        const pk = await (k as any).getPublicKey();
        if (pk) return k;
      }
    } catch {
      // Continue to wallet detection below if not connected
    }

    if (typeof window !== 'undefined') {
      const anyWindow = window as unknown as {
        freighterApi?: unknown;
        lobstrApi?: unknown;
        xBullApi?: unknown;
      };

      if (anyWindow.freighterApi) {
        await k.setWallet('freighter');
        return k;
      }
      if (anyWindow.lobstrApi) {
        await k.setWallet('lobstr');
        return k;
      }
      if (anyWindow.xBullApi) {
        await k.setWallet('xbull');
        return k;
      }
    }

    throw new Error('No wallet module selected. Please connect your wallet in the header first.');
  }


  // Simplified signing function with better error handling
  async function signTransaction(xdr: string, address: string): Promise<string> {
    const k = await ensureWalletModuleSelected();
    
    try {
      console.log('Signing transaction with wallet...');
      setStatus('Signing transaction...');
      
      // Try standard signing first
      const { signedTxXdr } = await (k as any).signTransaction(xdr, {
        address,
        networkPassphrase: Networks.PUBLIC,
      });
      
      console.log('Transaction signed successfully');
      return signedTxXdr;
      
    } catch (signError: any) {
      console.error('Wallet signing error:', signError);
      
      // Provide more descriptive error messages
      let errorMessage = 'Transaction signing failed';
      
      if (signError.message) {
        if (signError.message.includes('User declined')) {
          errorMessage = 'Transaction was cancelled by user';
        } else if (signError.message.includes('User rejected')) {
          errorMessage = 'Transaction was rejected by user';
        } else if (signError.message.includes('timeout')) {
          errorMessage = 'Signing timeout - please try again';
        } else if (signError.message.includes('network')) {
          errorMessage = 'Network error during signing - check your connection';
        } else {
          errorMessage = `Signing error: ${signError.message}`;
        }
      } else if (signError.code) {
        errorMessage = `Signing error (${signError.code}): Please check your wallet connection`;
      }
      
      throw new Error(errorMessage);
    }
  }

  const handleMaxClick = () => {
    // Reserve some XLM for fees (about 0.00001 XLM)
    const maxAmount = Math.max(0, walletBalance - 0.00001);
    setXlmAmount(maxAmount.toFixed(7));
  };

  const handleAmountChange = (value: string) => {
    // Only allow valid numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setXlmAmount(value);
    }
  };

  const handleRateToggle = () => {
    setShowInverseRate(!showInverseRate);
  };

  const refreshMarketRate = async () => {
    setIsLoadingMarketRate(true);
    try {
      const response = await fetch('/api/price');
      if (response.ok) {
        const priceData = await response.json();
        setMarketRate(priceData.price.XLM);
      }
    } catch (error) {
      console.error('Error refreshing market rate:', error);
    } finally {
      setIsLoadingMarketRate(false);
    }
  };

  const getDisplayRate = () => {
    // Use market rate if available, otherwise fall back to swap quote rate
    let rate = 0;
    
    if (marketRate > 0) {
      // Use market rate from API
      rate = showInverseRate ? (1 / marketRate) : marketRate;
    } else if (impliedRate !== '—' && impliedRate !== '0.0000000') {
      // Fall back to swap quote rate
      const swapRate = parseFloat(impliedRate);
      if (!isNaN(swapRate) && swapRate > 0) {
        rate = showInverseRate ? (1 / swapRate) : swapRate;
      }
    }
    
    return rate > 0 ? rate.toFixed(7) : '0.0000000';
  };

  async function handleSwap() {
    try {
      if (!walletAddress) {
        setStatus('Please connect your wallet first.');
        return;
      }
      if (!xlmAmount || Number(xlmAmount) <= 0) {
        setStatus('Enter a positive XLM amount.');
        return;
      }
      if (Number(xlmAmount) > walletBalance) {
        setStatus('Insufficient balance for this swap.');
        return;
      }
      if (slippagePct < 0.5 || slippagePct > 3) {
        setStatus('Slippage must be between 0.5% and 3%.');
        return;
      }

      setBusy(true);
      setStatus('Preparing transaction...');

      // Get the current quote (already calculated in real-time)
      const paths = await server.strictSendPaths(Asset.native(), String(xlmAmount), [CODY]).call() as StellarPathsResponse;
      if (!paths.records.length) {
        setStatus('No viable route found. Try a smaller amount.');
        return;
      }

      const best = [...paths.records].sort(
        (a, b) => Number(b.destination_amount) - Number(a.destination_amount)
      )[0];

      const destAmountNum = Number(best.destination_amount);
      const destMinNum = destAmountNum * (1 - slippagePct / 100);
      const destMin = destMinNum.toFixed(7);

      // Validate that the path can actually handle this amount
      if (destAmountNum <= 0) {
        setStatus('Invalid swap amount. Try a smaller amount.');
        return;
      }

      const pathAssets = toSdkAssets(best.path);

      setStatus('Preparing transaction...');
      const account = await server.loadAccount(walletAddress);
      const needTrustline = !hasCodyTrustline(account as unknown as StellarAccount);

      if (needTrustline) {
        const nativeBal = Number(
          ((account as unknown as StellarAccount).balances.find((b: StellarBalance) => b.asset_type === 'native')?.balance as string) || '0'
        );
        const baseReserve = await fetchBaseReserveXLM();
        const currentMin = (2 + Number(account.subentry_count || 0)) * baseReserve;
        const available = nativeBal - currentMin;
        const requiredExtra = baseReserve;
        const feeBuffer = 0.001;

        if (available < requiredExtra + feeBuffer) {
          const short = requiredExtra + feeBuffer - available;
          setStatus(`Insufficient reserve to add trustline. You need about ${short.toFixed(6)} more XLM.`);
          return;
        }
      }

      const baseFee = await server.fetchBaseFee();
      let tb = new TransactionBuilder(account as any, {
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

      setStatus('Signing transaction...');
      const signedXdr = await signTransaction(tx.toXDR(), walletAddress);
      const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.PUBLIC);

      setStatus('Submitting to network...');
      
      try {
        console.log('Submitting transaction to Horizon...');
        console.log('Transaction hash:', signedTx.hash());
        
        const result = await server.submitTransaction(signedTx);
        console.log('Transaction submitted successfully:', result.hash);
        
        // Transaction submitted successfully
        handleSwapSuccess(result.hash, xlmAmount, estReceived);
        
      } catch (submitError: any) {
        console.error('Transaction submission error:', submitError);
        
        // Extract and format error message
        let errorMessage = 'Transaction failed';
        
        if (submitError?.response?.data?.extras?.result_codes) {
          const resultCodes = submitError.response.data.extras.result_codes;
          
          if (resultCodes.transaction) {
            errorMessage = `Transaction error: ${resultCodes.transaction}`;
          } else if (resultCodes.operations && resultCodes.operations.length > 0) {
            const opErrors = resultCodes.operations.filter((op: string) => op !== 'op_success');
            if (opErrors.length > 0) {
              errorMessage = `Operation errors: ${opErrors.join(', ')}`;
            }
          }
        } else if (submitError?.message) {
          errorMessage = submitError.message;
        }
        
        setStatus(`❌ ${errorMessage}`);
        return;
      }
    } catch (err: unknown) {
      console.error(err);
      const stellarErr = err as StellarError;
      const opCodes = stellarErr?.response?.data?.extras?.result_codes?.operations;
      const msg = opCodes || stellarErr?.message || 'An error occurred. Please try again.';
      setStatus(`❌ ${msg}`);
    } finally {
      setBusy(false);
    }
  }

  // Function to refresh balances with visual feedback
  const refreshBalancesWithAnimation = async () => {
    try {
      // Reload account info to get fresh balances
      if (walletAddress) {
        setIsLoadingBalance(true);
        try {
          const account = await server.loadAccount(walletAddress);
          
          // Load XLM balance
          const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native');
          const xlmBalance = nativeBalance ? parseFloat(nativeBalance.balance) : 0;
          setWalletBalance(xlmBalance);
          
          // Load CODY balance
          const codyBalanceItem = account.balances.find((b: any) => 
            b.asset_code === 'CODY' && b.asset_issuer === CODY.getIssuer()
          );
          const codyBal = codyBalanceItem ? parseFloat(codyBalanceItem.balance) : 0;
          setCodyBalance(codyBal);
        } catch (error) {
          console.error('Error refreshing balances:', error);
        } finally {
          setIsLoadingBalance(false);
        }
      }
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000);
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  };

  // Enhanced success handling in handleSwap
  const handleSwapSuccess = (hash: string, xlmSpent: string, codyReceived: string) => {
    setStatus(`🎉 Swap successful! You received ${codyReceived} CODY for ${xlmSpent} XLM. Transaction hash: ${hash}`);
    
    // Clear input after a short delay
    setTimeout(() => {
      setXlmAmount('');
      setEstReceived('0.0000000');
      setImpliedRate('0.0000000');
      setMinReceived('0.0000000');
      setPriceImpact('0.00%');
      setRouteStr('—');
    }, 2000);
    
    // Refresh balances with animation
    setTimeout(() => {
      refreshBalancesWithAnimation();
    }, 1000);
  };


  const swapDisabled = busy || !walletAddress || !xlmAmount || Number(xlmAmount) <= 0 || Number(xlmAmount) > walletBalance;

  return (

    <div className="swap-container">
      <div className="swap-card">
                 {/* Swap Title */}
         <div className="swap-title-section">
           <h2>Swap XLM for CODY</h2>
           <div className="wallet-info">
             {walletAddress ? (
               <div className="wallet-details">
                 <span className="wallet-address">
                   {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                 </span>
                 {isMultiSig && (
                   <span className="multi-sig-badge">
                     🔐 Multi-Sig ({multiSigSigners.length} signers)
                   </span>
                 )}
               </div>
             ) : (
               <span className="wallet-disconnected">Wallet not connected</span>
             )}
           </div>
         </div>

        {/* From Section */}
        <div className="swap-section from-section">
          <div className="section-header">
            <span className="section-label">From</span>
            <div className="balance-info">
              <span className="balance-label">Balance:</span>
              {isLoadingBalance ? (
                <span className="balance-loading">Loading...</span>
              ) : (
                <button 
                  className={`balance-amount clickable ${showSuccessAnimation ? 'balance-updated' : ''}`}
                  onClick={handleMaxClick}
                  disabled={!walletAddress || walletBalance === 0}
                >
                  {walletBalance.toFixed(7)} XLM
                </button>
              )}
            </div>
      </div>


          <div className="input-container">
      <input

              type="text"
        value={xlmAmount}

              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.0"
              className="amount-input"
              disabled={!walletAddress}
            />
            <button 
              className="max-button"
              onClick={handleMaxClick}
              disabled={!walletAddress || walletBalance === 0}
            >
              MAX
            </button>
            <div className="asset-selector">
              <div className="asset-icon xlm-icon">★</div>
              <span className="asset-name">XLM</span>
            </div>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="swap-arrow">
          <div className="arrow-icon">↓</div>
        </div>

        {/* To Section */}
        <div className="swap-section to-section">
          <div className="section-header">
            <span className="section-label">To (estimated)</span>
                       <div className="balance-info">
             <span className="balance-label">Balance:</span>
             {isLoadingBalance ? (
               <span className="balance-loading">Loading...</span>
             ) : (
               <span className={`balance-amount ${showSuccessAnimation ? 'balance-updated' : ''}`}>{codyBalance.toFixed(7)} CODY</span>
             )}
           </div>
          </div>
          
                     <div className="output-container">
             <div className="estimated-output">
               {estReceived !== '—' && estReceived !== '0.0000000' ? estReceived : '0.0000000'}
             </div>
            <div className="asset-selector">
              <div className="asset-icon cody-icon">🎵</div>
              <span className="asset-name">CODY</span>
            </div>
          </div>
        </div>

                          {/* Exchange Rate */}
         <div className="exchange-rate">
           <span>
             {isLoadingMarketRate ? (
               'Loading market rate...'
             ) : (
               `1 ${showInverseRate ? 'XLM' : 'CODY'} = ${getDisplayRate()} ${showInverseRate ? 'CODY' : 'XLM'}`
             )}
           </span>
                        <div className="rate-buttons">
            <button

                 className={`refresh-button ${isLoadingMarketRate ? 'loading' : ''}`} 
                 onClick={refreshMarketRate} 
                 title="Refresh market rate"
                 disabled={isLoadingMarketRate}
               >
                 {isLoadingMarketRate ? '⟳' : '↻'}
            </button>

               <button className="toggle-button" onClick={handleRateToggle} title="Toggle rate display">
                 ↕
               </button>
        </div>
      </div>


                 {/* Swap Button */}
            <button
        onClick={handleSwap}
        disabled={swapDisabled}
        className={`swap-button ${swapDisabled ? 'disabled' : ''} ${showSuccessAnimation ? 'swap-success' : ''}`}
         >
           {busy ? 'Swapping...' : 'Swap'}
      </button>


        {/* Transaction Details */}
        <div className="transaction-details">
          <div className="detail-row">
            <span className="detail-label">
              <span className="info-icon">ℹ</span>
              Minimum received
            </span>
            <span className="detail-value">{minReceived}</span>
      </div>


          <div className="detail-row">
            <span className="detail-label">
              <span className="info-icon">ℹ</span>
              Price impact
            </span>
            <span className="detail-value price-impact">{priceImpact}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">
              <span className="info-icon">ℹ</span>
              Slippage tolerance
            </span>
            <div className="slippage-buttons">
              {[0.5, 1, 2].map((p) => (
                <button
                  key={p}
                  onClick={() => setSlippagePct(p)}
                  className={`slippage-button ${p === slippagePct ? 'active' : ''}`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">
              <span className="info-icon">ℹ</span>
              Route
            </span>
            <span className="detail-value route">{routeStr}</span>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div className={`status-message ${status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : 'info'}`}>
        {status}

          </div>
        )}
      </div>

      <style jsx>{`
        .swap-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

          .swap-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 32px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .swap-title-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .swap-title-section h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
        }

                 .wallet-info {
           font-size: 14px;
         }

         .wallet-details {
           display: flex;
           flex-direction: column;
           gap: 4px;
           align-items: flex-end;
         }

         .wallet-address {
           background: linear-gradient(135deg, #667eea, #764ba2);
           color: white;
           padding: 6px 12px;
           border-radius: 12px;
           font-weight: 500;
         }

         .multi-sig-badge {
           background: linear-gradient(135deg, #ff6b6b, #ee5a24);
           color: white;
           padding: 4px 8px;
           border-radius: 8px;
           font-size: 12px;
           font-weight: 500;
         }

        .wallet-disconnected {
          color: #666;
          font-style: italic;
        }

        .swap-section {
          margin-bottom: 16px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .section-label {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .balance-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .balance-label {
          color: #666;
        }

        .balance-amount {
          font-weight: 600;
          color: #1a1a1a;
        }

        .balance-amount.clickable {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-weight: 600;
          color: #667eea;
          text-decoration: underline;
        }

        .balance-amount.clickable:hover {
          color: #764ba2;
        }

        .balance-amount.clickable:disabled {
          color: #ccc;
          cursor: not-allowed;
          text-decoration: none;
        }

        .balance-updated {
          animation: balancePulse 2s ease-in-out;
          background: linear-gradient(45deg, #28a745, #20c997);
          background-size: 200% 200%;
          color: white !important;
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
        }

        @keyframes balancePulse {
          0% {
            background-position: 0% 50%;
            transform: scale(1);
          }
          50% {
            background-position: 100% 50%;
            transform: scale(1.05);
          }
          100% {
            background-position: 0% 50%;
            transform: scale(1);
          }
        }

        .balance-loading {
          color: #999;
          font-style: italic;
        }

        .input-container {
          display: flex;
          align-items: center;
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 16px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .input-container:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .amount-input {
          flex: 1;
          border: none;
          background: none;
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          outline: none;
        }

        .amount-input::placeholder {
          color: #ccc;
        }

        .max-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          margin: 0 12px;
          transition: all 0.2s ease;
        }

        .max-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .max-button:disabled {
          background: #e9ecef;
          color: #999;
          cursor: not-allowed;
        }

        .asset-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .asset-selector:hover {
          border-color: #667eea;
        }

        .asset-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        }

        .xlm-icon {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
        }

        .cody-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .asset-name {
          font-weight: 600;
          color: #1a1a1a;
        }

        .swap-arrow {
          display: flex;
          justify-content: center;
          margin: 16px 0;
        }

        .arrow-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .output-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 16px;
          padding: 16px;
        }

        .estimated-output {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .exchange-rate {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          font-size: 14px;
          color: #666;
        }

                 .rate-buttons {
           display: flex;
           gap: 8px;
         }

         .refresh-button,
         .toggle-button {
           background: none;
           border: none;
           color: #667eea;
           cursor: pointer;
           font-size: 16px;
           padding: 4px;
           border-radius: 4px;
           transition: all 0.2s ease;
         }

         .refresh-button:hover,
         .toggle-button:hover {
           background: rgba(102, 126, 234, 0.1);
         }

         .refresh-button.loading {
           animation: spin 1s linear infinite;
         }

         .refresh-button:disabled {
           opacity: 0.6;
           cursor: not-allowed;
         }

         @keyframes spin {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
         }

        .swap-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 16px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          margin: 24px 0;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .swap-button:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .swap-button.disabled {
          background: #e9ecef;
          color: #999;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .swap-success {
          animation: swapSuccess 1s ease-in-out;
          background: linear-gradient(135deg, #28a745, #20c997) !important;
        }

        @keyframes swapSuccess {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .transaction-details {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 20px;
          margin-top: 24px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .detail-row:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }

        .info-icon {
          color: #667eea;
          font-weight: bold;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .price-impact {
          color: #28a745;
        }

        .slippage-buttons {
          display: flex;
          gap: 8px;
        }

        .slippage-button {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slippage-button.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
        }

        .slippage-button:hover:not(.active) {
          border-color: #667eea;
        }

        .route {
          font-size: 12px;
          color: #666;
          max-width: 200px;
          text-align: right;
          word-break: break-all;
        }

        .status-message {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .status-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .status-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .status-message.info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        @media (max-width: 480px) {
          .swap-card {
            padding: 20px;
            margin: 10px;
            max-width: 100%;
            width: 100%;
          }

          .swap-title-section {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .input-container {
            flex-direction: column;
            gap: 12px;
          }

          .max-button {
            align-self: flex-end;
            margin: 0;
          }

          .asset-selector {
            align-self: flex-end;
          }
          
          .route {
            max-width: 100%;
            word-break: break-all;
            font-size: 11px;
            text-align: left;
          }
          
          .amount-input {
            width: 100%;
            max-width: 100%;
          }
          
          .swap-button {
            width: 100%;
          }
        }
      `}</style>
      </div>
  );
}

