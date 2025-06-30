// 📁 src/components/StatsCard.tsx
import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
    price: string;
    supply: string;
    balance: string;
}

export default function StatsCard({ price, supply, balance }: StatsCardProps) {
    return (
        <div className="stats-container">
            <div className="stats-card">
                <h3 className="stats-label">Token Price</h3>
                <p className="stats-value">{price}</p>
            </div>
            <div className="stats-card">
                <h3 className="stats-label">Total Supply</h3>
                <p className="stats-value">{supply}</p>
            </div>
            <div className="stats-card">
                <h3 className="stats-label">Your Balance</h3>
                <p className="stats-value">{balance}</p>
            </div>
        </div>
    );
}