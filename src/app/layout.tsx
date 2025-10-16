// 📁 src/app/layout.tsx
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import Navbar from "@/components/Navbar";

import type {Metadata} from "next";
import React from "react";

const PAGE_TITLE = "$CODY Token";
const PAGE_DESCRIPTION = "The Future of Music Investment on the Stellar Blockchain";

export const metadata: Metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en-US" suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <title></title>
            </head>
            <body className="body-background" suppressHydrationWarning>
                <WalletProvider>
                    <Navbar />
                    {children}
                </WalletProvider>
            </body>
        </html>
    );
}
