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
        <html lang="en-US">
            <body className="body-background">
                <WalletProvider>
                    <Navbar />
                    {children}
                </WalletProvider>
            </body>
        </html>
    );
}
