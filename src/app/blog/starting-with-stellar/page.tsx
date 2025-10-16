import React from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PostMeta from '@/components/PostMeta';
import AddressDisplay from '@/components/AddressDisplay';

export default function BlogPostStartingWithStellar() {
    return (
        <div className="text-page">
            <main className="main-content">
                <article className="blog-container blog-post">
                    <p><Link href="/blog">← Back to Blog</Link></p>
                    <h1>Getting Started on Stellar: Wallets, XLM, Trustlines, Swaps and LPs</h1>
                    <PostMeta date="Mar 2025" readTime="6 min read" />
                    <p>
                        This guide walks you through installing a Stellar wallet (like Lobstr), buying Stellar Lumens (XLM) either inside the app or using CoinDisco, establishing a trustline to the CODY token, and understanding what swapping and liquidity pools are.
                    </p>

                    <h2>1) Install a Stellar Wallet (Lobstr)</h2>
                    <ol>
                        <li>Go to <a href="https://lobstr.co" target="_blank" rel="noopener noreferrer">lobstr.co</a> and download the app for iOS, Android, or use the web version.</li>
                        <li>Create a new wallet. Save your secret recovery phrase securely and never share it.</li>
                        <li>Complete any security steps (PIN/biometrics) and back up your wallet.</li>
                    </ol>

                    <h2>2) Buy XLM (In-App or via CoinDisco)</h2>
                    <p>
                        XLM is the native coin of the Stellar network. You need a small amount of XLM to activate your account and pay minimal network fees.
                    </p>
                    <h3>In-App Purchase</h3>
                    <ol>
                        <li>Open Lobstr and tap Buy/Deposit.</li>
                        <li>Select XLM and choose a payment method available in your region.</li>
                        <li>Complete KYC if required by the provider, confirm the amount, and purchase.</li>
                        <li>Wait for XLM to appear in your wallet balance.</li>
                    </ol>
                    <h3>Using CoinDisco</h3>
                    <ol>
                        <li>Create/sign in to your CoinDisco account and purchase XLM.</li>
                        <li>Go to Withdraw and paste your Stellar public address (starts with <code>G</code>).</li>
                        <li>Memo: leave empty unless the provider explicitly requires one for your destination.</li>
                        <li>Confirm the withdrawal and wait for confirmation in your wallet.</li>
                    </ol>

                    <div className="callout">
                        Tip: Your Stellar public address starts with a G (e.g. <code>G...</code>). Double-check the address when withdrawing.
                    </div>

                    <h2>3) Establish a Trustline to CODY</h2>
                    <p>
                        On Stellar, tokens are issued by accounts and you must explicitly trust an asset before holding it. This is called a trustline.
                    </p>
                    <ol>
                        <li>Open your wallet and search for the asset code <code>CODY</code>.</li>
                        <li>Confirm the issuer: <AddressDisplay address="GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" />.</li>
                        <li>Add/Trust the asset. A small XLM reserve is required by the network.</li>
                    </ol>
                    <p>
                        You can also verify the asset on Stellar Expert: {" "}
                        <a href="https://stellar.expert/explorer/public/asset/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" target="_blank" rel="noopener noreferrer">CODY on Stellar Expert</a>.
                    </p>

                    <h2>4) What is Swapping?</h2>
                    <p>
                        Swapping is exchanging one asset for another through a decentralized exchange (DEX). On Stellar, swaps route through orderbooks or liquidity pools to give you the best rate.
                    </p>
                    <ul>
                        <li>You can swap XLM for CODY or via intermediate assets like USDC depending on liquidity.</li>
                        <li>Wallets and DEX UIs handle the routing; you confirm the quote and sign the transaction.</li>
                    </ul>

                    <h2>5) What is a Liquidity Pool (LP)?</h2>
                    <p>
                        A liquidity pool is a smart-contract-like pool that holds two assets in reserve. Traders swap against the pool, and the price adjusts based on the pool ratio. Liquidity providers deposit both assets and earn a share of trading fees.
                    </p>
                    <ul>
                        <li>Example: a CODY/USDC pool. Swappers trade between CODY and USDC using the pool’s reserves.</li>
                        <li>LP providers take on price risk but earn fees for providing liquidity.</li>
                    </ul>

                    <h2>Next Steps</h2>
                    <ul>
                        <li>Buy a bit of XLM for fees and to activate your account.</li>
                        <li>Add the CODY trustline with the correct issuer.</li>
                        <li>Use your wallet or a Stellar DEX to swap XLM/USDC for CODY.</li>
                    </ul>
                </article>
            </main>
            <Footer />
        </div>
    );
}


