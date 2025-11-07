// 📁 src/context/StellarWalletsContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk";
import { SwkAppDarkTheme } from "@creit-tech/stellar-wallets-kit/types";
import { KitEventType } from "@creit-tech/stellar-wallets-kit/types";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";
import { Networks } from "@stellar/stellar-sdk";

interface StellarWalletsContextValue {
    kitInitialized: boolean;
    address: string | null;
}

const StellarWalletsContext = createContext<StellarWalletsContextValue>({
    kitInitialized: false,
    address: null,
});

export function StellarWalletsProvider({ children }: { children: ReactNode }) {
    const [kitInitialized, setKitInitialized] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        // Only initialize in browser environment
        if (typeof window === "undefined") return;

        try {
            const STELLAR_NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'public';
            
            // Initialize the kit with default modules
            StellarWalletsKit.init({
                theme: SwkAppDarkTheme,
                modules: defaultModules(),
                network: STELLAR_NETWORK === 'public' ? Networks.PUBLIC : Networks.TESTNET,
            });

            setKitInitialized(true);
        } catch (error) {
            console.error('Failed to initialize StellarWalletsKit:', error);
            // Still mark as initialized to prevent UI blocking
            setKitInitialized(true);
        }

        // Listen for state updates
        const unsubscribeState = StellarWalletsKit.on(
            KitEventType.STATE_UPDATED,
            (event) => {
                if (event.payload?.address) {
                    setAddress(event.payload.address);
                }
            }
        );

        // Listen for disconnect events
        const unsubscribeDisconnect = StellarWalletsKit.on(
            KitEventType.DISCONNECT,
            () => {
                setAddress(null);
            }
        );

        // Try to get current address if already connected
        StellarWalletsKit.getAddress()
            .then((result) => {
                if (result?.address) {
                    setAddress(result.address);
                }
            })
            .catch(() => {
                // Not connected, ignore error
            });

        return () => {
            unsubscribeState();
            unsubscribeDisconnect();
        };
    }, []);

    return (
        <StellarWalletsContext.Provider value={{ kitInitialized, address }}>
            {children}
        </StellarWalletsContext.Provider>
    );
}

export function useStellarWallets() {
    return useContext(StellarWalletsContext);
}
