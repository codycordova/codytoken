"use client";

import React from "react";
import Footer from "../../components/Footer";
import TrustlineButton from "../../components/TrustlineButton";
import AddressDisplay from "../../components/AddressDisplay";
import { useWallet } from "@/context/WalletContext";

// ✅ client-only import so nothing tries to touch `window` on the server
import dynamic from "next/dynamic";
const AtomicSwapCard = dynamic(() => import("@/components/AtomicSwapCard"), { ssr: false });

export default function PurchasePage() {
  const { walletAddress } = useWallet();

  return (
    <div className="text-page">
      <main className="main-content">
        {/* Security Notice */}
        <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            background: 'rgba(255, 234, 0, 0.1)',
            border: '1px solid rgba(255, 234, 0, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#ffea00', marginBottom: '1rem' }}>🔒 Security Notice</h3>
            <p style={{ color: '#e0e0e0', marginBottom: '0.5rem' }}>
              <strong>Always verify the issuer address:</strong>{' '}
              <AddressDisplay address="GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" />
            </p>
            <p style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>
              This is the official CODY Token issuer. Never trust addresses from unofficial sources.
            </p>
          </div>
        </section>

        {/* Trustline Section */}
        <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            background: 'rgba(34,34,64,0.85)',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            margin: '0 auto 1rem',
            maxWidth: 500,
            color: '#e0e7ff',
            boxShadow: '0 2px 16px #7f9cf5',
            fontSize: '1.05rem',
          }}>
            <span role="img" aria-label="info">ℹ️</span>{' '}
            <b>Adding a custom asset on Stellar requires a 0.5 XLM minimum reserve.</b> This is a network rule to prevent spam and keep the blockchain efficient. You can remove the trustline later to reclaim your XLM.
          </div>

          {!walletAddress ? (
            <div style={{ color: '#ffb4b4', fontWeight: 500, marginTop: '1rem' }}>
              Please connect your wallet to interact with $CODY.
            </div>
          ) : (
            <TrustlineButton walletAddress={walletAddress} />
          )}
        </section>

        {/* Balance Summary Section */}
        {walletAddress && (
          <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{
              background: 'rgba(34,34,64,0.85)',
              borderRadius: '16px',
              padding: '1.5rem 2rem',
              margin: '0 auto 1rem',
              maxWidth: 500,
              color: '#e0e7ff',
              boxShadow: '0 2px 16px rgba(127, 156, 245, 0.2)',
              fontSize: '1.05rem',
            }}>
              <h3 style={{ color: '#ffea00', marginBottom: '1rem' }}>💰 Your Wallet</h3>
              <p style={{ color: '#a5b4fc', marginBottom: '1rem' }}>
                View all your asset balances and transaction history
              </p>
              <a 
                href="/balances" 
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #ff4dc4, #7f9cf5)',
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 4px 20px rgba(255, 77, 196, 0.3)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                View Balances →
              </a>
            </div>
          </section>
        )}

        {/* Page Title */}
        <h1 className="purchase-title">Buy &amp; Swap $CODY Token</h1>
        <p className="purchase-subtitle">
          We&apos;ve simplified things. To buy or swap for $CODY Token, please use the swap table below.
        </p>

        {/* ✅ Atomic Swap card (client-only, one-signature, multi-op) */}
        <AtomicSwapCard walletAddress={walletAddress || undefined} />

        <hr className="separator" />

        {/* Static project details */}
        <section className="details-section">
          <div className="details-column">
            <h2>$CODY Token Details</h2>
            <p>
              $CODY Token is a custom asset on the Stellar Blockchain. It
              powers Cody Cordova&apos;s music ecosystem, game economy, merch, and
              more.
            </p>
            <p>
              Issuing address:{" "}
              <strong>
                <AddressDisplay address="GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" />
              </strong>
            </p>
            <p>Total Supply: 444,444,444,444 $CODY</p>
          </div>

          <div className="details-column">
            <h2>Project Goals</h2>
            <ul>
              <li>✅ Update website with full Web3 Stellar integration</li>
              <li>📱 Build custom CODY Token wallet app</li>
              <li>🎮 Develop play-to-earn game that rewards $CODY</li>
            </ul>
          </div>

          <div className="details-column">
            <h2>Cody Cordova – Music Artist Links</h2>
            <ul>
              <li><a href="https://www.codycordova.com/">Official Site</a></li>
              <li><a href="https://open.spotify.com/artist/677lOpgqlsN820JS4ER4ds">Spotify</a></li>
              <li><a href="https://music.apple.com/us/artist/cody-cordova/1536505416">Apple Music</a></li>
              <li><a href="https://www.youtube.com/@realcodycordova">YouTube</a></li>
              <li><a href="https://twitter.com/realcodycordova">Twitter</a></li>
              <li><a href="https://www.instagram.com/realcodycordova/">Instagram</a></li>
            </ul>
          </div>

          <div className="details-column">
            <h2>Explore $CODY on Stellar</h2>
            <ul>
              <li><a href="https://stellar.expert/explorer/public/asset/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Stellar Expert</a></li>
              <li><a href="https://stellarchain.io/assets/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">StellarChain</a></li>
              <li><a href="https://lumenscan.io/assets/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Lumenscan</a></li>
            </ul>
          </div>

          <div className="details-column">
            <h2>Buy $CODY on Stellar Marketplaces</h2>
            <ul>
              <li><a href="https://lobstr.co/trade/CODY:GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Lobstr</a></li>
              <li><a href="https://www.stellarx.com/swap/native/CODY:GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">StellarX</a></li>
              <li><a href="https://stellarterm.com/swap/XLM-native/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">StellarTerm</a></li>
              <li><a href="https://obm.lumenswap.io/swap/XLM/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Lumenswap</a></li>
              <li><a href="https://scopuly.com/trade/CODY-XLM/GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Scopuly</a></li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
