import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="page-section">
      <div className="contact-section">
        <h2>Contact & Support</h2>
        <p>Get in touch with the CODY Token team</p>
        
        <div className="contact-grid">
          <div className="contact-card">
            <h3>📧 General Support</h3>
            <p>For general questions, technical support, or feedback about CODY Token:</p>
            <a href="mailto:support@codytoken.com" className="contact-link">
              support@codytoken.com
            </a>
          </div>

          <div className="contact-card">
            <h3>🤝 Business Inquiries</h3>
            <p>For partnerships, collaborations, or business opportunities:</p>
            <a href="mailto:business@codytoken.com" className="contact-link">
              business@codytoken.com
            </a>
          </div>

          <div className="contact-card">
            <h3>⚖️ Privacy & Legal</h3>
            <p>For privacy concerns, legal matters, or data requests:</p>
            <a href="mailto:privacy@codytoken.com" className="contact-link">
              privacy@codytoken.com
            </a>
          </div>

          <div className="contact-card">
            <h3>📰 Media & Press</h3>
            <p>For media inquiries, interviews, or press releases:</p>
            <a href="mailto:press@codytoken.com" className="contact-link">
              press@codytoken.com
            </a>
          </div>
        </div>

        <div className="social-section">
          <h3>Connect With Us</h3>
          <p>Follow CODY Token on social media for the latest updates and community discussions:</p>
          
          <div className="social-links">
            <a 
              href="https://twitter.com/realcodycordova" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link"
            >
              🐦 Twitter
            </a>
            
            <a 
              href="https://t.me/codytokenxlm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link"
            >
              💬 Telegram
            </a>
            
            <a 
              href="https://discord.gg/WYHdtRMueC" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link"
            >
              🕹 Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
