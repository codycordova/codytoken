// 📁 src/components/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
    price: string;
    supply: string;
    balance: string;
}

export default function StatsCard({ price, supply, balance }: StatsCardProps) {
    return (
        <div className="legacy-stats-container">
            <div className="legacy-stats-card">
                <h3 className="legacy-stats-label">Token Price</h3>
                <p className="legacy-stats-value">{price}</p>
            </div>
            <div className="legacy-stats-card">
                <h3 className="legacy-stats-label">Total Supply</h3>
                <p className="legacy-stats-value">{supply}</p>
            </div>
            <div className="legacy-stats-card">
                <h3 className="legacy-stats-label">Your Balance</h3>
                <p className="legacy-stats-value">{balance}</p>
            </div>
        </div>
    );
}