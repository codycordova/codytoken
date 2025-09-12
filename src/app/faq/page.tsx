"use client";
import React, { useState } from 'react';
import Footer from '../../components/Footer';
import './FAQ.css';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "What is CODY Token?",
        answer: "CODY Token is a custom asset created on the Stellar Blockchain by Cody Cordova, a music producer, DJ, and indie developer. It's designed for fans to support Cody's projects, purchase merchandise and concert tickets, or trade as they wish. It's a fun, community-based project that explores the intersection of technology, music, finance, and social respect."
    },
    {
        question: "How do I buy CODY Token?",
        answer: "You can purchase CODY tokens through the Stellar DEX using any Stellar wallet like Lobstr, StellarX, or Freighter. First, you'll need XLM (Stellar Lumens) in your wallet, then you can swap XLM for CODY tokens. Make sure to establish a trustline to CODY token first. Check our 'Purchase' page for detailed instructions."
    },
    {
        question: "Do I need a wallet to use CODY Token?",
        answer: "Yes, you'll need a Stellar wallet to hold and trade CODY tokens. Popular options include Lobstr (mobile-friendly), StellarX (web-based), or Freighter (browser extension). All of these wallets support CODY token and make it easy to manage your tokens."
    },
    {
        question: "Is CODY Token an investment?",
        answer: "No, CODY Token is not a security, investment, or financial product. It's a fun, community-based project with no expected return on investment. While you can trade CODY tokens, there are no promises or expectations of profits, gains, or financial returns. It's designed for community engagement and supporting Cody's creative projects."
    },
    {
        question: "What can I do with CODY Token?",
        answer: "CODY tokens can be used to purchase merchandise, concert tickets, or other items from CODY CORDOVA LLC. You can also trade, swap, or sell your tokens freely on the Stellar DEX. The token is designed to create a direct connection between Cody and his community of supporters."
    },
    {
        question: "How do I establish a trustline to CODY?",
        answer: "To hold CODY tokens, you need to establish a trustline. In your Stellar wallet, go to 'Add Asset' or 'Manage Assets', then search for 'CODY' with the asset code 'CODY' and issuer 'GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK'. Confirm the trustline and you'll be able to receive CODY tokens."
    },
    {
        question: "Is CODY Token safe?",
        answer: "CODY Token is built on the Stellar blockchain, which is a secure and well-established network. However, as with any cryptocurrency, you should practice good security habits like keeping your seed phrase safe, using reputable wallets, and being cautious of phishing attempts. Always verify you're interacting with the official CODY token contract."
    },
    {
        question: "Can I use CODY Token on my phone?",
        answer: "Yes! CODY token works great on mobile devices. We recommend using the Lobstr mobile app, which provides an excellent mobile experience for managing Stellar assets including CODY tokens. The Stellar network is designed to be mobile-friendly with fast, low-cost transactions."
    },
    {
        question: "What's the difference between CODY Token and other cryptocurrencies?",
        answer: "CODY Token is unique because it's created by a specific artist (Cody Cordova) and is designed to support his creative projects directly. Unlike general-purpose cryptocurrencies, CODY has a specific use case: connecting fans with an artist's work and merchandise. It's built on Stellar, which offers fast, low-cost transactions compared to other blockchains."
    },
    {
        question: "How can I stay updated on CODY Token news?",
        answer: "Follow us on Twitter (@realcodycordova), join our Telegram group (@codytokenxlm), or check our Discord server. We regularly post updates about new features, merchandise drops, and community events. You can also check our blog for detailed articles about the project."
    }
];

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const toggleItem = (index: number) => {
        setOpenItems(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="faq-page">
            <main className="faq-container">
                <h1 className="faq-title">Frequently Asked Questions</h1>
                <p className="faq-subtitle">Everything you need to know about CODY Token</p>
                
                <div className="faq-list">
                    {faqData.map((item, index) => (
                        <div key={index} className="faq-item">
                            <button 
                                className="faq-question"
                                onClick={() => toggleItem(index)}
                                aria-expanded={openItems.includes(index)}
                            >
                                <span className="faq-question-text">{item.question}</span>
                                <span className="faq-icon">
                                    {openItems.includes(index) ? '−' : '+'}
                                </span>
                            </button>
                            {openItems.includes(index) && (
                                <div className="faq-answer">
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
