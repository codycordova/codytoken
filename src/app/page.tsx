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
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
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
                    <div id="home" className="launch-sequence">
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
                                        text="Ur baby mama&apos;s favorite DJ has his own currency" 
                                        fontSize={18} 
                                        className="spray-animate"
                                        color="#000000"
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
                                    <GraffitiHeroText text="Ur baby mama&apos;s favorite DJ has his own currency" fontSize={28} width={600} className="spray-animate" />
                                    <GraffitiHeroText text="And its on the Stellar Blockchain" fontSize={32} width={500} className="spray-animate" />
                                </div>
                            </div>

                            {/* Hero CTA Buttons */}
                            <div className="hero-cta-buttons reveal">
                                <Link href="/purchase" className="cta-button primary">
                                    Get Started
                                </Link>
                                <a href="#faq" className="cta-button secondary">
                                    Learn More
                                </a>
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

                    {/* Trust & Security Section */}
                    <section className="trust-section reveal">
                        <div className="trust-container">
                            <h2 className="section-title">🔒 Trusted & Secure</h2>
                            <div className="trust-badges">
                                <div className="trust-badge">
                                    <div className="trust-icon">🛡️</div>
                                    <h3>Stellar Blockchain</h3>
                                    <p>Built on the secure, fast, and eco-friendly Stellar network</p>
                                </div>
                                <div className="trust-badge">
                                    <div className="trust-icon">🔍</div>
                                    <h3>Fully Transparent</h3>
                                    <p>All transactions are publicly verifiable on the blockchain</p>
                                </div>
                                <div className="trust-badge">
                                    <div className="trust-icon">⚡</div>
                                    <h3>Low Fees</h3>
                                    <p>Stellar&apos;s network fees are fractions of a penny</p>
                                </div>
                                <div className="trust-badge">
                                    <div className="trust-icon">🌱</div>
                                    <h3>Eco-Friendly</h3>
                                    <p>Stellar uses minimal energy compared to other blockchains</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section id="stats" className="stats-section reveal">
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
                        <div className="widget-container">
                            <iframe
                                title="StellarExpert Asset Summary"
                                src="https://stellar.expert/widget/public/asset/summary/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK"
                                style={{ 
                                    border: 'none', 
                                    overflow: 'hidden', 
                                    maxWidth: '100%', 
                                    minWidth: '300px', 
                                    maxHeight: '100%', 
                                    minHeight: '200px', 
                                    width: '100%',
                                }}
                                onLoad={(e) => {
                                    const c = e.currentTarget;
                                    window.addEventListener('message', function({data, source}) {
                                        if (c && source === c.contentWindow && data.widget === c.src) {
                                            c.style.height = data.height + 'px';
                                        }
                                    }, false);
                                }}
                            />
                        </div>
                        <div className="widget-container">
                            <iframe
                                title="StellarExpert Price History"
                                src="https://stellar.expert/widget/public/asset/price/CODY-GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK"
                                style={{ 
                                    border: 'none', 
                                    overflow: 'hidden', 
                                    maxWidth: '100%', 
                                    minWidth: '300px', 
                                    maxHeight: '100%', 
                                    minHeight: '200px', 
                                    width: '100%',
                                }}
                                onLoad={(e) => {
                                    const c = e.currentTarget;
                                    window.addEventListener('message', function({data, source}) {
                                        if (c && source === c.contentWindow && data.widget === c.src) {
                                            c.style.height = data.height + 'px';
                                        }
                                    }, false);
                                }}
                            />
                        </div>
                    </section>

                    {/* Final CTA Section */}
                    <section className="final-cta-section reveal">
                        <div className="cta-content">
                            <h2 className="section-title">Ready to Join the Revolution?</h2>
                            <p className="cta-description">
                                Be part of the future of music and blockchain technology. Start your journey with CODY Token today.
                            </p>
                            <div className="cta-buttons">
                                <a href="#purchase" className="cta-button primary large">
                                    Buy CODY Token
                                </a>
                                <a href="#contact" className="cta-button secondary large">
                                    Get Support
                                </a>
                            </div>
                            
                            {/* Quick Access Links */}
                            <div className="quick-access">
                                <Link href="/tokenomics" className="quick-link">Tokenomics</Link>
                                <Link href="/whitepaper" className="quick-link">Whitepaper</Link>
                                <Link href="/docs" className="quick-link">Developer Docs</Link>
                            </div>
                        </div>
                    </section>

                    {/* Educational Section */}
                    <section className="education-section reveal">
                        <div className="education-container">
                            <h2 className="section-title">🎓 New to Cryptocurrency?</h2>
                            <p className="education-subtitle">Don&apos;t worry! We&apos;ll guide you through everything step by step.</p>
                            
                            <div className="education-steps">
                                <div className="education-step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <h3>Get a Stellar Wallet</h3>
                                        <p>Download Lobstr (mobile) or Freighter (browser) - both are free and easy to use!</p>
                                        <div className="step-links">
                                            <a href="https://lobstr.co" target="_blank" rel="noopener noreferrer" className="step-link">Download Lobstr</a>
                                            <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="step-link">Download Freighter</a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="education-step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <h3>Buy Some XLM</h3>
                                        <p>XLM (Stellar Lumens) is the native currency. You can buy it directly in your wallet or on exchanges like Coinbase.</p>
                                        <div className="step-links">
                                            <a href="https://coinbase.com" target="_blank" rel="noopener noreferrer" className="step-link">Buy on Coinbase</a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="education-step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <h3>Establish Trustline</h3>
                                        <p>This tells your wallet you want to hold CODY tokens. It&apos;s like adding a new currency to your wallet.</p>
                                        <div className="step-links">
                                            <a href="/purchase" className="step-link">Set Up Trustline</a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="education-step">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                        <h3>Swap XLM for CODY</h3>
                                        <p>Use our swap tool to exchange your XLM for CODY tokens. It&apos;s fast, secure, and transparent!</p>
                                        <div className="step-links">
                                            <a href="/purchase" className="step-link">Start Swapping</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <FAQ />

                    {/* Contact Section */}
                    <Contact />
                </main>
                <Footer />
            </div>
        </Providers>
    );
}
