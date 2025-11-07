'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit/sdk';
import { Horizon } from '@stellar/stellar-sdk';
import { useWallet } from '@/context/WalletContext';
import { useStellarWallets } from '@/context/StellarWalletsContext';
import * as Sentry from '@sentry/nextjs';

const STELLAR_NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'public';
const TOKEN_CODE = process.env.NEXT_PUBLIC_TOKEN_CODE || 'CODY';
const TOKEN_ISSUER = process.env.NEXT_PUBLIC_TOKEN_ISSUER || '';

export default function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const { kitInitialized } = useStellarWallets();
  const { walletAddress, setWalletAddress } = useWallet();
  const [xlmBalance, setXlmBalance] = useState<string>('0');
  const [codyBalance, setCodyBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Track client-side mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync wallet address from context (context already handles kit events)
  const { address: contextAddress } = useStellarWallets();
  
  useEffect(() => {
    if (contextAddress) {
      setWalletAddress(contextAddress);
      fetchBalances(contextAddress);
    } else {
      setWalletAddress('');
      setXlmBalance('0');
      setCodyBalance('0');
    }
  }, [contextAddress, setWalletAddress]);

  const connectWallet = async () => {
    if (!kitInitialized || !mounted) {
      console.warn('Wallet kit not ready:', { kitInitialized, mounted });
      return;
    }

    try {
      setLoading(true);
      console.log('Opening wallet connection modal...');
      
      // Small delay to ensure kit is fully ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { address } = await StellarWalletsKit.authModal();
      console.log('Wallet connected:', address);
      
      if (address) {
        setWalletAddress(address);
        await fetchBalances(address);
      }
    } catch (error: any) {
      // Check if user cancelled (code -1) - this is expected, don't show error
      if (error?.code === -1 || error?.message === 'No wallet has been connected.') {
        // User cancelled the modal - this is fine, just reset loading state
        console.log('User cancelled wallet connection');
        return;
      }
      
      // Actual error - log and show message
      console.error('Failed to connect wallet:', error);
      Sentry.captureException(error instanceof Error ? error : new Error('Connect wallet failed'), {
        tags: { component: 'WalletConnect', action: 'authModal' },
        extra: { 
          error: error instanceof Error ? error.message : String(error),
          code: error?.code,
        },
      });
      
      // Show user-friendly error message only for real errors
      const errorMessage = error?.message || 'Failed to connect wallet';
      if (errorMessage.includes('extension') || errorMessage.includes('installed')) {
        alert('Please install a Stellar wallet extension (Freighter, xBull, or Lobstr) and try again.');
      } else if (errorMessage.includes('unlocked') || errorMessage.includes('locked')) {
        alert('Please unlock your wallet extension and try again.');
      } else {
        alert(`Failed to connect wallet: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await StellarWalletsKit.disconnect();
      setWalletAddress('');
      setXlmBalance('0');
      setCodyBalance('0');
    } catch (error) {
      console.error('Disconnect failed:', error);
      Sentry.captureException(error instanceof Error ? error : new Error('Disconnect failed'), {
        tags: { component: 'WalletConnect', action: 'disconnect' },
      });
      // Still clear local state even if disconnect fails
      setWalletAddress('');
      setXlmBalance('0');
      setCodyBalance('0');
    }
  };

  const fetchBalances = async (address: string) => {
    try {
      // Access Server from Horizon namespace (works with browser bundle)
      const ServerClass = (Horizon as any).Server;
      const server = new ServerClass(
        STELLAR_NETWORK === 'public'
          ? 'https://horizon.stellar.org'
          : 'https://horizon-testnet.stellar.org'
      );

      const account = await server.loadAccount(address);
      const balances = account.balances;

      // Find XLM balance
      const xlm = balances.find((b: any) => b.asset_type === 'native');
      if (xlm) {
        setXlmBalance(parseFloat(xlm.balance).toFixed(7));
      } else {
        setXlmBalance('0');
      }

      // Find CODY balance
      if (TOKEN_ISSUER) {
        const cody = balances.find(
          (b: any) =>
            b.asset_type === 'credit_alphanum4' &&
            b.asset_code === TOKEN_CODE &&
            b.asset_issuer === TOKEN_ISSUER
        );
        if (cody) {
          setCodyBalance(parseFloat(cody.balance).toFixed(7));
        } else {
          setCodyBalance('0');
        }
      }
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      Sentry.captureException(error instanceof Error ? error : new Error('Fetch balances failed'), {
        tags: { component: 'WalletConnect', action: 'fetchBalances' },
      });
    }
  };

  useEffect(() => {
    if (walletAddress && kitInitialized && mounted) {
      fetchBalances(walletAddress);
      // Refresh balances every 10 seconds
      const interval = setInterval(() => fetchBalances(walletAddress), 10000);
      return () => clearInterval(interval);
    }
  }, [walletAddress, kitInitialized, mounted]);

  // Prevent hydration mismatch by showing same content on server and initial client render
  // Always render the button, but keep it disabled until mounted and initialized
  if (!mounted || !kitInitialized) {
    return (
      <button
        disabled
        className="wallet-connect-btn"
        style={{ opacity: 0.6, cursor: 'not-allowed' }}
      >
        Connect Wallet
      </button>
    );
  }

  if (walletAddress) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #1e1e2f 0%, #23234a 100%)',
            border: '1px solid rgba(165, 180, 252, 0.2)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            minWidth: '200px',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600 }}>Connected</span>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#a5b4fc' }}>
              {dropdownOpen ? '▲' : '▼'}
            </span>
          </div>
          <div style={{ 
            fontSize: '0.85em', 
            fontFamily: 'monospace', 
            color: '#e0e0e0',
            wordBreak: 'break-all'
          }}>
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <div style={{ 
              background: 'rgba(99, 102, 241, 0.1)', 
              borderRadius: '6px', 
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem'
            }}>
              <span style={{ color: '#a5b4fc' }}>XLM: </span>
              <span style={{ color: '#e0e0e0', fontWeight: 600 }}>{xlmBalance}</span>
            </div>
            {TOKEN_ISSUER && (
              <div style={{ 
                background: 'rgba(236, 72, 153, 0.1)', 
                borderRadius: '6px', 
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: '#ec4899' }}>{TOKEN_CODE}: </span>
                <span style={{ color: '#e0e0e0', fontWeight: 600 }}>{codyBalance}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Wallet Dropdown Menu */}
        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: '#1e1e2f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.5rem',
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
            }}
          >
            <Link
              href="/balances"
              style={{
                display: 'block',
                padding: '0.75rem 1rem',
                color: '#e0e0e0',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'rgba(255, 77, 196, 0.1)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'transparent';
              }}
              onClick={() => setDropdownOpen(false)}
            >
              💰 View Balances
            </Link>
            <Link
              href="/purchase"
              style={{
                display: 'block',
                padding: '0.75rem 1rem',
                color: '#e0e0e0',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'rgba(255, 77, 196, 0.1)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'transparent';
              }}
              onClick={() => setDropdownOpen(false)}
            >
              🛒 Buy CODY
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '0.5rem 0' }} />
            <button
              onClick={() => {
                disconnectWallet();
                setDropdownOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'transparent',
                color: '#ff6b6b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'transparent';
              }}
            >
              🔌 Disconnect
            </button>
          </div>
        )}
        
        {/* Click outside to close dropdown */}
        {dropdownOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <button
      className="wallet-connect-btn"
      onClick={connectWallet}
      disabled={loading}
      style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

WalletConnect.displayName = 'WalletConnect';
