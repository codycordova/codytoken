import React from 'react';
import Link from 'next/link';
import PostMeta from '@/components/PostMeta';
import Footer from '@/components/Footer';
import './Blog.css';

export default function BlogIndexPage() {
    return (
        <div className="page-wrapper">
            <main className="main-content">
                <div className="blog-container">
                    <h1 className="blog-title">Blog</h1>
                    <p className="blog-subtitle">Thoughts on crypto, Stellar, security, and $CODY.</p>

                    <div className="blog-list">
                        <article className="blog-card">
                            <h2>
                                <Link href="/blog/starting-with-stellar">Getting Started: Stellar Wallets, Buying XLM, and CODY Trustlines</Link>
                            </h2>
                            <p>
                                Learn how to install a Stellar wallet (like Lobstr), buy XLM in-app or via CoinDisco,
                                establish a trustline to CODY, and understand swaps and liquidity pools.
                            </p>
                            <PostMeta date="Mar 2025" readTime="6 min read" />
                        </article>
                        <article className="blog-card">
                            <h2>
                                <Link href="/blog/wallet-security">Wallet Security Best Practices</Link>
                            </h2>
                            <p>
                                Concrete steps to protect your seed phrase, avoid phishing, verify assets, and keep devices safe.
                            </p>
                            <PostMeta date="Mar 2025" readTime="4 min read" />
                        </article>
                        <article className="blog-card">
                            <h2>
                                <Link href="/blog/stellar-dex-walkthrough">Stellar DEX: Swaps and Liquidity Pools</Link>
                            </h2>
                            <p>
                                A practical walkthrough for swapping on Stellar and an overview of LPs, fees, and risks.
                            </p>
                            <PostMeta date="Mar 2025" readTime="5 min read" />
                        </article>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}


