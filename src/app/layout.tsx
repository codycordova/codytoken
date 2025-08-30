// 📁 src/app/layout.tsx
import "../globals.css";
import { WalletProvider } from "@/context/WalletContext";
import Navbar from "@/components/Navbar";

export const metadata = {
    title: "$CODY Token",
    description: "The Future of Music Investment on the Stellar Blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en-US" suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
