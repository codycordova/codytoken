import React from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';

export default function ContactPage() {
    return (
        <div className="text-page">
            <main className="main-content">
                <h1 className="contact-title">Contact & Support</h1>
                <p className="contact-subtitle">Get in touch with the CODY Token team</p>
                
                <div className="contact-grid">
                    <div className="contact-section">
                        <h2>General Support</h2>
                        <p>For general questions, technical support, or feedback about CODY Token:</p>
                        <div className="contact-method">
                            <span className="contact-icon">📧</span>
                            <a href="mailto:support@codytoken.com" className="contact-link">
                                support@codytoken.com
                            </a>
                        </div>
                    </div>

                    <div className="contact-section">
                        <h2>Business Inquiries</h2>
                        <p>For partnerships, collaborations, or business opportunities:</p>
                        <div className="contact-method">
                            <span className="contact-icon">🤝</span>
                            <a href="mailto:business@codytoken.com" className="contact-link">
                                business@codytoken.com
                            </a>
                        </div>
                    </div>

                    <div className="contact-section">
                        <h2>Privacy & Legal</h2>
                        <p>For privacy concerns, legal matters, or data requests:</p>
                        <div className="contact-method">
                            <span className="contact-icon">⚖️</span>
                            <a href="mailto:privacy@codytoken.com" className="contact-link">
                                privacy@codytoken.com
                            </a>
                        </div>
                    </div>

                    <div className="contact-section">
                        <h2>Media & Press</h2>
                        <p>For media inquiries, interviews, or press releases:</p>
                        <div className="contact-method">
                            <span className="contact-icon">📰</span>
                            <a href="mailto:press@codytoken.com" className="contact-link">
                                press@codytoken.com
                            </a>
                        </div>
                    </div>
                </div>

                <div className="social-section">
                    <h2>Connect With Us</h2>
                    <p>Follow CODY Token on social media for the latest updates and community discussions:</p>
                    
                    <div className="social-links">
                        <a 
                            href="https://twitter.com/realcodycordova" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <span className="social-icon">🐦</span>
                            <span className="social-text">Twitter</span>
                        </a>
                        
                        <a 
                            href="https://t.me/codytokenxlm" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <span className="social-icon">💬</span>
                            <span className="social-text">Telegram</span>
                        </a>
                        
                        <a 
                            href="https://discord.gg/WYHdtRMueC" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <span className="social-icon">🕹</span>
                            <span className="social-text">Discord</span>
                        </a>
                    </div>
                </div>

                <div className="response-time">
                    <h3>Response Times</h3>
                    <ul>
                        <li><strong>General Support:</strong> 24-48 hours</li>
                        <li><strong>Technical Issues:</strong> 12-24 hours</li>
                        <li><strong>Business Inquiries:</strong> 2-3 business days</li>
                        <li><strong>Privacy/Legal:</strong> 3-5 business days</li>
                    </ul>
                </div>

                <div className="helpful-links">
                    <h3>Helpful Resources</h3>
                    <div className="resource-links">
                        <Link href="/#faq" className="resource-link">Frequently Asked Questions</Link>
                        <a href="/blog" className="resource-link">Blog & Tutorials</a>
                        <a href="/terms" className="resource-link">Terms of Service</a>
                        <a href="/privacy" className="resource-link">Privacy Policy</a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
