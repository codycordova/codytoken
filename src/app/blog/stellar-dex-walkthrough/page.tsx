import React from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PostMeta from '@/components/PostMeta';

export default function StellarDexWalkthroughPost() {
    return (
        <div className="text-page">
            <main className="main-content">
                <article className="blog-container blog-post">
                    <p><Link href="/blog">← Back to Blog</Link></p>
                    <h1>Swapping on Stellar and Understanding Liquidity Pools</h1>
                    <PostMeta date="Mar 2025" readTime="5 min read" />
                    <p>
                        This walkthrough shows how to swap on Stellar using wallet/DEX interfaces and explains how liquidity pools (LPs) work, including fees and risks.
                    </p>

                    <h2>Prerequisites</h2>
                    <ul>
                        <li>A funded Stellar wallet with some XLM for fees.</li>
                        <li>The CODY trustline added if you plan to swap into CODY.</li>
                    </ul>

                    <h2>Swap Workflow (Wallet/DEX)</h2>
                    <ol>
                        <li>Open your wallet or a Stellar DEX UI and choose Swap/Trade.</li>
                        <li>Select the asset you are paying with (e.g., XLM or USDC).</li>
                        <li>Select the asset you want to receive (e.g., CODY).</li>
                        <li>Enter the amount. Review the quoted rate, slippage, and fees.</li>
                        <li>Confirm and sign the transaction. Wait for network confirmation (usually seconds).</li>
                        <li>Verify the received asset balance in your wallet.</li>
                    </ol>

                    <h2>What Liquidity Pools Do</h2>
                    <p>
                        Liquidity pools hold two assets in reserve. Traders swap against the pool. Pricing follows a curve (e.g., constant product), and a small fee is charged per trade. Fees are distributed to LP providers proportionally to their share of the pool.
                    </p>
                    <ul>
                        <li>Example pair: CODY/USDC. If demand for CODY rises, the pool price adjusts as the ratio changes.</li>
                        <li>Better liquidity generally means lower slippage for swappers.</li>
                    </ul>

                    <h2>Providing Liquidity (Advanced)</h2>
                    <ol>
                        <li>Hold both assets in the pair (e.g., CODY and USDC) and open the LP interface.</li>
                        <li>Deposit equal-value amounts of each asset into the pool.</li>
                        <li>Receive LP tokens representing your share of the pool and fee claim.</li>
                        <li>Withdraw later to redeem your share (+ accumulated fees), subject to price changes.</li>
                    </ol>
                    <div className="callout">
                        Risk note: LP providers can experience impermanent loss if the asset prices diverge. Fees may or may not offset it.
                    </div>

                    <h2>Troubleshooting</h2>
                    <ul>
                        <li>If you can’t receive an asset, ensure the trustline is set and you have enough XLM reserve.</li>
                        <li>Check slippage settings in volatile markets.</li>
                        <li>Confirm the issuer when selecting tokens to avoid lookalikes.</li>
                    </ul>
                </article>
            </main>
            <Footer />
        </div>
    );
}


