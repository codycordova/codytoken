// 📁 src/app/providers.tsx
"use client";

import { WalletProvider } from "@/context/WalletContext";
import { StellarWalletsProvider } from "@/context/StellarWalletsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <StellarWalletsProvider>
            <WalletProvider>
                {children}
            </WalletProvider>
        </StellarWalletsProvider>
    );
}
