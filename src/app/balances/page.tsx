// src/app/balances/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { useWallet } from '@/context/WalletContext';

interface BalanceLine {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

export default function BalancesPage() {
    const { walletAddress } = useWallet();
    const [balances, setBalances] = useState<BalanceLine[]>([]);

    useEffect(() => {
        if (!walletAddress) return;
        fetch(`https://horizon.stellar.org/accounts/${walletAddress}`)
            .then(res => res.json())
            .then(data => setBalances(data.balances || []));
    }, [walletAddress]);

    return (
        <div className="text-page">
            <main className="main-content">
                <h1 className="hero-title">Balances</h1>
                {walletAddress ? (
                    <>
                        <div className="wallet-id"><strong>Wallet Address:</strong> {walletAddress}</div>
                        <ul className="balances-list">
                            {balances.map((bal, i) => (
                                <li className="balance-card" key={i}>
                                    <div><strong>{bal.asset_type === "native" ? "XLM" : bal.asset_code}</strong>: {bal.balance}</div>
                                    {bal.asset_type !== "native" && (
                                        <div className="issuer">Issuer: {bal.asset_issuer}</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>Please connect your wallet to view balances.</p>
                )}
            </main>
            <Footer />
        </div>
    );
}
