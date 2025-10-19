// 📁 src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-sections">
            
            {/* Explore Section */}
            <div className="footer-section">
              <h4 className="footer-heading">Explore</h4>
              <ul className="footer-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/#stats">Stats</Link></li>
                <li><Link href="/#faq">FAQ</Link></li>
                <li><Link href="/#contact">Contact</Link></li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="footer-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><Link href="/purchase">Buy CODY</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/tokenomics">Tokenomics</Link></li>
                <li><Link href="/whitepaper">Whitepaper</Link></li>
                <li><Link href="/docs">Developer Docs</Link></li>
              </ul>
            </div>

            {/* Connect Section */}
            <div className="footer-section">
              <h4 className="footer-heading">Connect</h4>
              <ul className="footer-links">
                <li><a href="https://twitter.com/realcodycordova" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://t.me/codytokenxlm" target="_blank" rel="noopener noreferrer">Telegram</a></li>
                <li><a href="https://discord.gg/WYHdtRMueC" target="_blank" rel="noopener noreferrer">Discord</a></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>

            {/* About Section */}
            <div className="footer-section">
              <h4 className="footer-heading">About</h4>
              <p className="footer-description">
                CODY Token is a custom asset on the Stellar blockchain created by Cody Cordova, 
                connecting fans with music, merchandise, and community.
              </p>
            </div>

          </div>
          
          <div className="footer-bottom">
            <p className="footer-copy">&copy; 2025 CODY CORDOVA LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
}