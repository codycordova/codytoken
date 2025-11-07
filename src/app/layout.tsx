// 📁 src/app/layout.tsx
import "./globals.css";
import Providers from "@/app/providers";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";

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
        <html lang="en-US" data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name="theme-color" content="#0a0a0a" />
                <meta name="color-scheme" content="dark" />
                {/* Disable Cloudflare Rocket Loader for Next.js scripts */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            // Disable Cloudflare Rocket Loader for Next.js chunks
                            if (window.$RocketLoader) {
                                window.$RocketLoader = 0;
                            }
                            // Mark all Next.js scripts to skip Rocket Loader
                            document.addEventListener('DOMContentLoaded', function() {
                                const scripts = document.querySelectorAll('script[src*="/_next/static"]');
                                scripts.forEach(script => {
                                    script.setAttribute('data-cfasync', 'false');
                                });
                            });
                        `,
                    }}
                />
                <title></title>
            </head>
            <body className="body-background" suppressHydrationWarning>
                <Providers>
                    <ErrorBoundary>
                        <Navbar />
                        {children}
                    </ErrorBoundary>
                </Providers>
            </body>
        </html>
    );
}
