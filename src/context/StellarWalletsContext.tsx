// 📁 src/context/StellarWalletsContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    type ReactNode,
} from "react";
import {
    StellarWalletsKit,
    WalletNetwork,
    FreighterModule,
    xBullModule,
    FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";

interface StellarWalletsContextValue {
    kit: StellarWalletsKit | null;
}

const StellarWalletsContext = createContext<StellarWalletsContextValue>({
    kit: null,
});

export function StellarWalletsProvider({ children }: { children: ReactNode }) {
    const [kit, setKit] = useState<StellarWalletsKit | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonAddedRef = useRef(false);

    useEffect(() => {
        if (kit || buttonAddedRef.current) return;

        const newKit = new StellarWalletsKit({
            network: WalletNetwork.PUBLIC,
            selectedWalletId: FREIGHTER_ID,
            modules: [new FreighterModule(), new xBullModule()],
        });

        newKit.createButton({
            container: containerRef.current!,
            buttonText: "Connect Stellar Wallet",
            onConnect: ({ address }) => {
                console.log("Connected:", address);
            },
            onDisconnect: () => {
                console.log("Disconnected");
            },
        });

        buttonAddedRef.current = true;
        setKit(newKit);

        // Capture the containerRef value for cleanup
        const container = containerRef.current;
        return () => {
            if (container) container.innerHTML = "";
            buttonAddedRef.current = false;
        };
    }, [kit]);

    return (
        <StellarWalletsContext.Provider value={{ kit }}>
            {/* Wallet connect button will be rendered here */}
            <div ref={containerRef} />
            {children}
        </StellarWalletsContext.Provider>
    );
}

export function useStellarWallets() {
    return useContext(StellarWalletsContext);
}
