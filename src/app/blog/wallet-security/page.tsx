import React from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';
import '../Blog.css';
import PostMeta from '@/components/PostMeta';

export default function WalletSecurityPost() {
    return (
        <div className="page-wrapper">
            <main className="main-content">
                <article className="blog-container blog-post">
                    <p><Link href="/blog">← Back to Blog</Link></p>
                    <h1>Wallet Security Best Practices</h1>
                    <PostMeta date="Mar 2025" readTime="4 min read" />
                    <p>
                        Crypto security starts with protecting your keys. Here are practical steps to keep your Stellar wallet and your CODY safe.
                    </p>

                    <h2>Protect Your Secret Phrase</h2>
                    <ul>
                        <li>Write it down on paper and store in multiple secure locations. Do not take screenshots.</li>
                        <li>Never share your secret phrase or private key. No admin will ever ask for it.</li>
                        <li>Consider a metal backup for fire/water resistance.</li>
                    </ul>

                    <h2>Secure Your Devices</h2>
                    <ul>
                        <li>Enable device lock (PIN/biometric) and OS updates.</li>
                        <li>Install wallet app only from official stores or the official website.</li>
                        <li>Use unique, strong passwords and a password manager.</li>
                    </ul>

                    <h2>Avoid Phishing</h2>
                    <ul>
                        <li>Bookmark official domains, and always check the URL before connecting or signing.</li>
                        <li>Beware of DMs and fake support accounts. Verify announcements via official channels.</li>
                        <li>Do not sign unknown transactions. Read prompts carefully.</li>
                    </ul>

                    <h2>Verify Assets Before Trusting</h2>
                    <p>
                        On Stellar, always confirm the issuer when adding a trustline. For CODY:
                    </p>
                    <div className="callout">
                        Issuer: <code>GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK</code>
                    </div>
                    <p>
                        You can double-check on Stellar Expert:
                        {" "}
                        <a href="https://stellar.expert/explorer/public/asset/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" target="_blank" rel="noopener noreferrer">CODY on Stellar Expert</a>.
                    </p>

                    <h2>Transaction Hygiene</h2>
                    <ul>
                        <li>Start with a small test transaction when sending to a new address.</li>
                        <li>Only include a Memo when a service explicitly instructs you to.</li>
                        <li>Keep a small XLM buffer to cover network reserves and fees.</li>
                    </ul>

                    <h2>Advanced Tips</h2>
                    <ul>
                        <li>Consider hardware wallets supported by Stellar-compatible tools for larger holdings.</li>
                        <li>Segment funds across wallets for different purposes (daily vs long-term).</li>
                        <li>Regularly review connected sites and revoke access you no longer use.</li>
                    </ul>
                </article>
            </main>
            <Footer />
        </div>
    );
}


