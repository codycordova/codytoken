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
  const kit = useMemo(
    () =>
      new StellarWalletsKit({
        network: WalletNetwork.PUBLIC,
        modules: allowAllModules(),
      }),
    []
  );


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

  async function ensureWalletModuleSelected() {
    try {

      await kit.getAddress();
      return;
    } catch {

        // Try to detect and set the appropriate wallet
        if (typeof window !== 'undefined') {
          // Check for Freighter
          if ((window as unknown as { freighterApi?: unknown }).freighterApi) {
            await kit.setWallet('freighter');
        return;
      }

          // Check for Lobstr
          if ((window as unknown as { lobstrApi?: unknown }).lobstrApi) {
            await kit.setWallet('lobstr');
            return;
          }
          // Check for xBull
          if ((window as unknown as { xBullApi?: unknown }).xBullApi) {
            await kit.setWallet('xbull');
            return;
          }
        }
      throw new Error('No wallet module selected. Please connect your wallet in the header first.');
    }
  }

  // LOBSTR Vault API integration
  async function submitToLobstrVault(signedXdr: string): Promise<any> {
    try {
      console.log('Submitting to LOBSTR Vault API...');
      const response = await fetch('https://vault.lobstr.co/api/transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          xdr: signedXdr
        })
      });
      
      if (!response.ok) {
        throw new Error(`Vault API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Vault API response:', result);
      return result;
    } catch (error) {
      console.error('Error submitting to LOBSTR Vault:', error);
      throw error;
    }
  }

  // Poll for vault transaction status
  async function pollVaultTransactionStatus(transactionId: string): Promise<any> {
    try {
      const response = await fetch(`https://vault.lobstr.co/api/transactions/${transactionId}`);
      if (!response.ok) {
        throw new Error(`Vault status check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error polling vault status:', error);
      throw error;
    }
  }

  // Enhanced signing function for multi-sig
  async function signWithMultiSigSupport(xdr: string, address: string): Promise<string> {
    await ensureWalletModuleSelected();
    
    try {
      // First step: Sign with the connected wallet (LOBSTR)
      console.log('Step 1: Signing with connected wallet...');
      const { signedTxXdr } = await kit.signTransaction(xdr, {
        address,
        // Remove networkPassphrase for Lobstr compatibility
      });
      
             // If this is a multi-sig account, submit to Vault
       if (isMultiSig) {
         console.log('Step 2: Multi-sig detected, submitting to LOBSTR Vault...');
         setStatus('🔐 Multi-sig detected: Submitting to Vault for approval...');
         
         try {
           const vaultResponse = await submitToLobstrVault(signedTxXdr);
           
           if (vaultResponse.status === 'pending' || vaultResponse.status === 'submitted') {
             // Store the vault transaction ID for reference
             setStatus('🔐 Transaction submitted to Vault. Please approve in your LOBSTR Vault app.');
             
             // Poll for completion
             let attempts = 0;
             const maxAttempts = 60; // 5 minutes with 5-second intervals
             
             const pollInterval = setInterval(async () => {
               attempts++;
               try {
                 const status = await pollVaultTransactionStatus(vaultResponse.id || vaultResponse.transaction_id);
                 
                 if (status.status === 'approved' || status.status === 'completed') {
                   clearInterval(pollInterval);
                   setStatus('✅ Vault approval received! Finalizing transaction...');
                   return status.signed_xdr || signedTxXdr; // Return the fully signed XDR
                 } else if (status.status === 'rejected' || status.status === 'failed') {
                   clearInterval(pollInterval);
                   throw new Error('Transaction rejected by Vault');
                 } else if (attempts >= maxAttempts) {
                   clearInterval(pollInterval);
                   throw new Error('Vault approval timeout. Please check your Vault app.');
                 }
               } catch (error) {
                 console.error('Error polling vault status:', error);
                 if (attempts >= maxAttempts) {
                   clearInterval(pollInterval);
                   throw error;
                 }
               }
             }, 5000); // Poll every 5 seconds
             
             // For now, return the partially signed XDR
             // The polling will handle the completion
             return signedTxXdr;
           } else if (vaultResponse.status === 'approved' || vaultResponse.status === 'completed') {
             setStatus('✅ Vault approval received! Finalizing transaction...');
             return vaultResponse.signed_xdr || signedTxXdr;
           } else {
             throw new Error(`Unexpected vault response status: ${vaultResponse.status}`);
           }
         } catch (vaultError) {
           console.error('Vault submission error:', vaultError);
           setStatus('❌ Vault submission failed. Please try again or check your Vault app.');
           throw vaultError;
         }
       }
      
      // Single-sig flow
      return signedTxXdr;
    } catch (signError: any) {
      console.error('Wallet signing error:', signError);
      
      // Check if it's a multi-signing scenario
      if (signError.message?.includes('multi') || signError.message?.includes('signature')) {
        throw new Error('Multi-signing detected: Please complete the signing process in your wallet interface (Lobstr + Vault).');
      }
      
      throw signError;
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
      const signedXdr = await signWithMultiSigSupport(tx.toXDR(), walletAddress);
      const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.PUBLIC);

      setStatus('Submitting to network...');
      
      try {
        console.log('Submitting transaction to Horizon...');
        console.log('Transaction XDR:', signedTx.toXDR());
        console.log('Transaction hash:', signedTx.hash());
        
        // Try submitting with different approaches
        let res;
        try {
          res = await server.submitTransaction(signedTx);
        } catch (firstError: any) {
          console.error('First submission attempt failed:', firstError);
          
          // Check for specific pathfinding errors
          if (firstError?.response?.data?.extras?.result_codes?.operations?.some((op: string) => 
            op.includes('path_payment_strict_send_no_issuer') || 
            op.includes('path_payment_strict_send_underfunded') ||
            op.includes('path_payment_strict_send_line_full') ||
            op.includes('path_payment_strict_send_cross_self')
          )) {
            setStatus('❌ Swap failed: Insufficient liquidity or invalid path. Try a smaller amount.');
            return;
          }
          
          // If it's a 400 error, it might be multi-signing
          if (firstError?.response?.status === 400 || firstError?.status === 400) {
            console.log('400 error detected - likely multi-signing scenario');
            setStatus(`🔐 Multi-signing detected: Please complete the signing process in your wallet interface (Lobstr + Vault).`);
            return;
          }
          
          // Try alternative submission method
          try {
            console.log('Trying alternative submission method...');
            // Try with a fresh transaction object
            const freshTx = TransactionBuilder.fromXDR(signedTx.toXDR(), Networks.PUBLIC);
            res = await server.submitTransaction(freshTx);
          } catch (secondError: any) {
            console.error('Second submission attempt also failed:', secondError);
            throw firstError; // Throw the original error for better debugging
          }
        }
        
        // Transaction submitted successfully
        handleSwapSuccess(res.hash, xlmAmount, estReceived);
      } catch (submitError: unknown) {
        console.error('Transaction submission error:', submitError);
        
        // Extract error information
        const errorObj = submitError as any;
        const errorMessage = errorObj?.message || errorObj?.toString() || 'Unknown error';
        const errorStatus = errorObj?.status || errorObj?.response?.status || errorObj?.code;
        const errorData = errorObj?.data || errorObj?.response?.data || errorObj?.extras;
        
        // Check for various error conditions
        const is400Error = errorStatus === 400 || errorMessage.includes('400') || errorMessage.includes('Request failed');
        const isMultiSigning = errorMessage.includes('Multi-signing detected') || 
                              errorMessage.includes('multi') ||
                              errorMessage.includes('auth') ||
                              errorMessage.includes('signature') ||
                              (errorData?.result_codes?.transaction === 'tx_bad_auth') ||
                              (errorData?.result_codes?.operations?.some((op: string) => op.includes('auth')));
        
        if (isMultiSigning) {
          setStatus(`🔐 Multi-signing detected: Please complete the signing process in your wallet interface (Lobstr + Vault).`);
        } else if (is400Error) {
          // Try to extract more specific error information
          let specificError = 'Transaction failed (400)';
          
          if (errorData?.result_codes?.transaction) {
            specificError = `Transaction error: ${errorData.result_codes.transaction}`;
          } else if (errorData?.result_codes?.operations && errorData.result_codes.operations.length > 0) {
            specificError = `Operation errors: ${errorData.result_codes.operations.join(', ')}`;
          } else if (errorData?.detail) {
            specificError = errorData.detail;
          } else if (errorMessage !== 'Unknown error') {
            specificError = errorMessage;
          }
          
          setStatus(`❌ ${specificError}`);
        } else {
          setStatus(`❌ ${errorMessage}`);
        }
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
                 {/* Header */}
         <div className="swap-header">
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
           {busy ? (isMultiSig ? 'Multi-Sig Signing...' : 'Swapping...') : (isMultiSig ? 'Swap (Multi-Sig)' : 'Swap')}
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

        .swap-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .swap-header h2 {
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
            max-width: calc(100vw - 20px);
            width: 100%;
          }

          .swap-header {
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

