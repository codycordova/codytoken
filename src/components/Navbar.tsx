// 📁 codytoken/src/components/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnect from "./WalletConnect";
import "./Navbar.css";
import Image from 'next/image';

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close menu on navigation
    React.useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    return (
        <nav className="navbar" aria-label="Main Navigation">
            <div className="navbar-logo">
                <Image src="/cclogo.png" alt="CODY Token Logo" className="logo" width={48} height={48} />
                <span className="logo-text">$CODY</span>
            </div>
            {/* Hamburger icon for mobile */}
            <button
                className="navbar-hamburger"
                aria-label="Open menu"
                aria-controls="main-navbar-menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
            >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect y="7" width="32" height="3.5" rx="1.75" fill="#fff" />
                    <rect y="14" width="32" height="3.5" rx="1.75" fill="#fff" />
                    <rect y="21" width="32" height="3.5" rx="1.75" fill="#fff" />
                </svg>
            </button>
            {/* Menu links and wallet, show/hide on mobile */}
            <div className={`navbar-menu${menuOpen ? ' open' : ''}`} id="main-navbar-menu">
                <ul className="navbar-links">
                    <li className={pathname === "/" ? "active" : ""}>
                        <Link href="/">Home</Link>
                    </li>
                    <li className={pathname === "/purchase" ? "active" : ""}>
                        <Link href="/purchase">Purchase</Link>
                    </li>
                    <li className={pathname === "/balances" ? "active" : ""}>
                        <Link href="/balances">Balances</Link>
                    </li>
                    <li className={pathname === "/tokenomics" ? "active" : ""}>
                        <Link href="/tokenomics">Tokenomics</Link>
                    </li>
                    <li className={pathname?.startsWith("/blog") ? "active" : ""}>
                        <Link href="/blog">Blog</Link>
                    </li>
                    <li className={pathname === "/faq" ? "active" : ""}>
                        <Link href="/faq">FAQ</Link>
                    </li>
                    <li className={pathname === "/contact" ? "active" : ""}>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
                <div className="navbar-wallet">
                    <WalletConnect />
                </div>
            </div>
        </nav>
    );
}
