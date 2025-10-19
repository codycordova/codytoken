// 📁 src/context/StellarWalletsContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import {
    StellarWalletsKit,
    WalletNetwork,
    FreighterModule,
    xBullModule,
    FREIGHTER_ID,
    LobstrModule,
} from "@creit.tech/stellar-wallets-kit";

interface StellarWalletsContextValue {
    kit: StellarWalletsKit | null;
}

const StellarWalletsContext = createContext<StellarWalletsContextValue>({
    kit: null,
});

export function StellarWalletsProvider({ children }: { children: ReactNode }) {
    const [kit, setKit] = useState<StellarWalletsKit | null>(null);

    useEffect(() => {
        if (kit) return;

        const newKit = new StellarWalletsKit({
            network: WalletNetwork.PUBLIC,
            selectedWalletId: FREIGHTER_ID,
            modules: [new FreighterModule(), new xBullModule(), new LobstrModule()],
        });
        setKit(newKit);
        return () => {
            // no-op cleanup
        };
    }, [kit]);

    return (
        <StellarWalletsContext.Provider value={{ kit }}>
            {children}
        </StellarWalletsContext.Provider>
    );
}

export function useStellarWallets() {
    return useContext(StellarWalletsContext);
}
