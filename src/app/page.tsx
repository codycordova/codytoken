"use client";
// 📁 src/app/page.tsx
import Providers from "./providers";
import Footer from "../components/Footer";
import CodyLogoScene from "../components/CodyLogoScene";
import "./Home.css";
import React, { useEffect, useRef } from 'react';
import CodyToken3D from '@/components/CodyToken3D';
import GraffitiHeroText from '../components/GraffitiHeroText';
import MobileHeroText from '../components/MobileHeroText';
import Link from 'next/link';

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const revealSections = document.querySelectorAll('.reveal');
        const onScroll = () => {
            revealSections.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 60) {
                    el.classList.add('visible');
                }
            });
        };
        window.addEventListener('scroll', onScroll);
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        // Parallax effect for hero texts
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const left = document.querySelector('.parallax-left') as HTMLElement | null;
            const right = document.querySelector('.parallax-right') as HTMLElement | null;
            if (left) left.style.setProperty('--parallax-left', `${scrollY * 0.2}px`);
            if (right) right.style.setProperty('--parallax-right', `${-scrollY * 0.2}px`);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Remove spray-animate class after animation for accessibility
        const hero = heroRef.current;
        if (!hero) return;
        const timer = setTimeout(() => {
            hero.querySelectorAll('.spray-animate').forEach(el => el.classList.remove('spray-animate'));
        }, 1700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Providers>
            <div className="page-wrapper">
                <main className="main-content">
                    {/* Hero Section */}
                    <div id="launch-sequence">
                        <div className="hero-container" ref={heroRef}>
                            {/* Mobile version */}
                            <div className="mobile-hero-title">
                                <MobileHeroText 
                                    text="$CODY Token" 
                                    fontSize={48} 
                                    className="spray-animate"
                                    color="#ffea00"
                                />
                            </div>
                            
                            {/* Desktop version */}
                            <div className="desktop-hero-title">
                                <GraffitiHeroText text="$CODY Token" fontSize={100} width={800} className="spray-animate" />
                            </div>
                            
                            <div className="hero-3d" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ width: '320px', maxWidth: '80vw', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CodyToken3D />
                                </div>
                            </div>

                            <div className="hero-sub-row">
                                {/* Mobile version */}
                                <div className="mobile-hero-subtitle">
                                    <MobileHeroText 
                                        text="Ur baby mama's favorite DJ has his own currency" 
                                        fontSize={18} 
                                        className="spray-animate"
                                        color="#ffffff"
                                    />
                                    <MobileHeroText 
                                        text="And its on the Stellar Blockchain" 
                                        fontSize={20} 
                                        className="spray-animate"
                                        color="#ffea00"
                                    />
                                </div>
                                
                                {/* Desktop version */}
                                <div className="desktop-hero-subtitle">
                                    <GraffitiHeroText text="Ur baby mama's favorite DJ has his own currency" fontSize={28} width={600} className="spray-animate" />
                                    <GraffitiHeroText text="And its on the Stellar Blockchain" fontSize={32} width={500} className="spray-animate" />
                                </div>
                            </div>

                            {/* Hero CTA Buttons */}
                            <div className="hero-cta-buttons reveal">
                                <Link href="/purchase" className="cta-button primary">
                                    Get Started
                                </Link>
                                <Link href="/faq" className="cta-button secondary">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mission Section */}
                    <section className="mission-section reveal">
                        <div className="mission-content">
                            <h2 className="section-title">Our Mission</h2>
                            <h3 className="mission-subtitle">Redefine music ownership and accessibility</h3>
                            <p className="mission-description">
                                We envision a future where artists have full control over their creations, fans have direct and transparent access to the best releases, and the industry is reshaped through the innovative use of blockchain technology.
                            </p>
                            <Link href="/whitepaper" className="cta-button secondary">
                                Explore Music
                            </Link>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="features-section reveal">
                        <h2 className="section-title">CODY Token Features</h2>
                        <h3 className="features-subtitle">Built for the future of creator economies</h3>
                        
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">🎵</div>
                                <h4>Merchandise & Tickets</h4>
                                <p>Redeem CODY tokens for exclusive Cody Cordova merchandise, concert tickets, and special event access.</p>
                            </div>
                            
                            <div className="feature-card">
                                <div className="feature-icon">🎮</div>
                                <h4>Play-to-Earn Gaming</h4>
                                <p>Future web-based RPGs and creative mini-games where you can earn CODY tokens through gameplay and creativity.</p>
                            </div>
                            
                            <div className="feature-card">
                                <div className="feature-icon">📊</div>
                                <h4>Live Analytics</h4>
                                <p>Real-time price data from multiple sources including Stellar DEX, Aqua AMM pools, and comprehensive market insights.</p>
                            </div>
                            
                            <div className="feature-card">
                                <div className="feature-icon">🖼️</div>
                                <h4>Digital Collectibles</h4>
                                <p>Limited-edition NFT drops and digital art pieces that can be purchased and traded using CODY tokens.</p>
                            </div>
                            
                            <div className="feature-card">
                                <div className="feature-icon">⚡</div>
                                <h4>Fast & Low-Cost</h4>
                                <p>Built on Stellar blockchain for lightning-fast transactions with minimal fees, perfect for micro-payments and trading.</p>
                            </div>
                            
                            <div className="feature-card">
                                <div className="feature-icon">🔒</div>
                                <h4>Transparent & Secure</h4>
                                <p>All transactions are publicly verifiable on the Stellar blockchain with full transparency and security.</p>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="stats-section reveal">
                        <h2 className="section-title">CODY Token by the Numbers</h2>
                        <div className="stats-grid-compact">
                            <div className="stat-card">
                                <div className="stat-number">444B</div>
                                <div className="stat-label">Total Supply</div>
                            </div>
                            <div className="stat-card featured">
                                <div className="stat-number">2,000</div>
                                <div className="stat-label">Circulating Supply</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">58</div>
                                <div className="stat-label">Trustlines</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">42K+</div>
                                <div className="stat-label">Total Trades</div>
                            </div>
                        </div>
                        <div className="stats-footer-compact">
                            <a 
                                href="https://stellar.expert/explorer/public/account/GBQVKVFXHM3SLYLSIFUNDI2VALQPGOEHLDJ3Z3OLHXS4PK4GN2FSLKLY" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="verify-link"
                            >
                                🔍 Verify Distribution Wallet
                            </a>
                        </div>
                    </section>

                    {/* Cody Logo Scene */}
                    <section className="reveal">
                        <CodyLogoScene />
                    </section>

                    {/* Live Data Section */}
                    <section className="stellar-widgets-row reveal fade-in">
                        <iframe
                            title="StellarExpert Asset Summary"
                            src="https://stellar.expert/widget/public/asset/summary/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK"
                            style={{ border: 'none', overflow: 'hidden', maxWidth: '100%', minWidth: '300px', maxHeight: '100%', minHeight: '200px', width: '100%' }}
                            onLoad={e => { const iframe = e.currentTarget; window.addEventListener('message', function ({ data, source }) {
                                if (iframe && source === iframe.contentWindow && data.widget === iframe.src) iframe.style.height = data.height + 'px';
                            }, false); }}
                        />
                        <iframe
                            title="StellarExpert Price History"
                            src="https://stellar.expert/widget/public/asset/price/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK"
                            style={{ border: 'none', overflow: 'hidden', maxWidth: '100%', minWidth: '300px', maxHeight: '100%', minHeight: '200px', width: '100%' }}
                            onLoad={e => { const iframe = e.currentTarget; window.addEventListener('message', function ({ data, source }) {
                                if (iframe && source === iframe.contentWindow && data.widget === iframe.src) iframe.style.height = data.height + 'px';
                            }, false); }}
                        />
                    </section>

                    {/* Final CTA Section */}
                    <section className="final-cta-section reveal">
                        <div className="cta-content">
                            <h2 className="section-title">Ready to Join the Revolution?</h2>
                            <p className="cta-description">
                                Be part of the future of music and blockchain technology. Start your journey with CODY Token today.
                            </p>
                            <div className="cta-buttons">
                                <Link href="/purchase" className="cta-button primary large">
                                    Buy CODY Token
                                </Link>
                                <Link href="/contact" className="cta-button secondary large">
                                    Get Support
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </Providers>
    );
}
