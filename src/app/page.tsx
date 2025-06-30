"use client";
// 📁 src/app/page.tsx
import Providers from "./providers";
import Footer from "../components/Footer";
import CodyLogoScene from "../components/CodyLogoScene";
import "./Home.css";
import React, { useEffect, useRef, useState } from 'react';
import CodyToken3D from '@/components/CodyToken3D';
import GraffitiHeroText from '../components/GraffitiHeroText';

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 900);
        };

        // Initial check
        checkIsMobile();

        // Listener for window resize
        window.addEventListener('resize', checkIsMobile);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

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
                <div className="parallax-bg"></div>
                <main className="main-content">
                    <div id="launch-sequence">
                        <div className="hero-container" ref={heroRef}>
                            <GraffitiHeroText text="$CODY Token" fontSize={isMobile ? 60 : 100} width={isMobile ? 350 : 800} className="spray-animate" />
                            
                            <div className="hero-3d" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ width: '320px', maxWidth: '80vw', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CodyToken3D />
                                </div>
                            </div>

                            <div className="hero-sub-row">
                                <GraffitiHeroText text="Ur baby mama's favorite DJ has his own currency" fontSize={isMobile ? 20 : 28} width={isMobile ? 320 : 600} className="spray-animate" />
                                <GraffitiHeroText text="And its on the Stellar Blockchain" fontSize={isMobile ? 22 : 32} width={isMobile ? 320 : 500} className="spray-animate" />
                            </div>
                        </div>
                        <section className="reveal">
                            <CodyLogoScene />
                        </section>
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
                    </div>
                </main>
                <Footer />
            </div>
        </Providers>
    );
}
