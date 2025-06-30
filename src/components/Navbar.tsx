// 📁 codytoken/src/components/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnect from "./WalletConnect";
import "./Navbar.css";
import Image from 'next/image';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="navbar" aria-label="Main Navigation">
            <div className="navbar-logo">
                <Image src="/cclogo.png" alt="CODY Token Logo" className="logo" width={48} height={48} />
                <span className="logo-text">$CODY</span>
            </div>

            <ul className="navbar-links">
                <li className={pathname === "/" ? "active" : ""}>
                    <Link href="/">Home</Link>
                </li>
                <li className={pathname === "/purchase" ? "active" : ""}>
                    <Link href="/purchase">Purchase</Link>
                </li>
                <li className={pathname === "/terms" ? "active" : ""}>
                    <Link href="/terms">Terms</Link>
                </li>
                <li className={pathname === "/whitepaper" ? "active" : ""}>
                    <Link href="/whitepaper">Whitepaper</Link>
                </li>
                <li className={pathname === "/balances" ? "active" : ""}>
                    <Link href="/balances">Balances</Link>
                </li>
            </ul>

            <div className="navbar-wallet">
                <WalletConnect />
            </div>
        </nav>
    );
}
