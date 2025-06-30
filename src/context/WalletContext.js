"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const [walletAddress, setWalletAddressState] = useState("");

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("walletAddress");
        if (saved) setWalletAddressState(saved);
    }, []);

    // Save to localStorage on change
    const setWalletAddress = (address) => {
        setWalletAddressState(address);
        if (address) {
            localStorage.setItem("walletAddress", address);
        } else {
            localStorage.removeItem("walletAddress");
        }
    };

    return (
        <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    return useContext(WalletContext);
}
