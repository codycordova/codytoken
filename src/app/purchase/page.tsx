"use client";

import React from "react";
import Footer from "../../components/Footer";
import "./Purchase.css";
import TrustlineButton from "../../components/TrustlineButton";
import { useWallet } from "@/context/WalletContext";

export default function PurchasePage() {
    const { walletAddress } = useWallet();
    return (
        <div className="purchase-page">
            <main className="purchase-container">
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
                        <span role="img" aria-label="info">ℹ️</span> 
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

                {/* Page Title */}
                <h1 className="purchase-title">Buy &amp; Swap $CODY Token</h1>
                <p className="purchase-subtitle">
                    We&apos;ve simplified things. To buy or swap for $CODY Token, please use one of the trusted Stellar marketplaces below.
                </p>

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
                                GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK
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
                            <li>
                                <a href="https://www.codycordova.com/">Official Site</a>
                            </li>
                            <li>
                                <a href="https://open.spotify.com/artist/677lOpgqlsN820JS4ER4ds">Spotify</a>
                            </li>
                            <li>
                                <a href="https://music.apple.com/us/artist/cody-cordova/1536505416">Apple Music</a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/@realcodycordova">YouTube</a>
                            </li>
                            <li>
                                <a href="https://twitter.com/realcodycordova">Twitter</a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/realcodycordova/">Instagram</a>
                            </li>
                        </ul>
                    </div>

                    <div className="details-column">
                        <h2>Explore $CODY on Stellar</h2>
                        <ul>
                            <li>
                                <a href="https://stellar.expert/explorer/public/asset/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Stellar Expert</a>
                            </li>
                            <li>
                                <a href="https://stellarchain.io/assets/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">StellarChain</a>
                            </li>
                            <li>
                                <a href="https://lumenscan.io/assets/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Lumenscan</a>
                            </li>
                        </ul>
                    </div>

                    <div className="details-column">
                        <h2>Buy $CODY on Stellar Marketplaces</h2>
                        <ul>
                            <li>
                                <a href="https://lobstr.co/trade/CODY:GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Lobstr</a>
                            </li>
                            <li>
                                <a href="https://www.stellarx.com/swap/native/CODY:GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">StellarX</a>
                            </li>
                            <li>
                                <a href="https://stellarterm.com/swap/XLM-native/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">StellarTerm</a>
                            </li>
                            <li>
                                <a href="https://obm.lumenswap.io/swap/XLM/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Lumenswap</a>
                            </li>
                            <li>
                                <a href="https://scopuly.com/trade/CODY-XLM/GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">Scopuly</a>
                            </li>
                            <li>
                                <a href="https://sdexexplorer.com/assets/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK">SDEX Explorer</a>
                            </li>
                        </ul>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
