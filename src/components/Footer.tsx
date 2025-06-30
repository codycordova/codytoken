// 📁 src/components/Footer.tsx
import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h4 className="footer-heading">Connect With Us</h4>
              <div className="footer-icons">
                  <a href="https://twitter.com/realcodycordova" target="_blank" rel="noopener noreferrer">🐦 Twitter</a>
                  <a href="https://t.me/codytokenxlm" target="_blank" rel="noopener noreferrer">💬 Telegram</a>
                  <a href="https://discord.gg/WYHdtRMueC" target="_blank" rel="noopener noreferrer">🕹 Discord</a>
              </div>
          </div>
          <p className="footer-copy">&copy; 2025 CODY CORDOVA LLC. All rights reserved.</p>
        </div>
      </footer>
  );
}