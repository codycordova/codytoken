"use client";
import React, { useState } from 'react';
import AddressDisplay from './AddressDisplay';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    question: "What is CODY Token?",
    answer: "CODY Token is a custom asset built on the Stellar blockchain by multimedia artist Cody Cordova. It serves as a utility token for fan interaction, merchandise access, gaming rewards, and community participation in the CODYverse ecosystem."
  },
  {
    question: "How do I buy CODY Token?",
    answer: "You can buy CODY Token by swapping XLM (Stellar Lumens) on Stellar DEX or through Aqua AMM pools. First, establish a trustline to CODY Token, then use your Stellar wallet to swap XLM for CODY."
  },
  {
    question: "Do I need a wallet to use CODY Token?",
    answer: "Yes, you need a Stellar-compatible wallet like Lobstr, Freighter, or StellarX to hold and transact with CODY Token. The wallet allows you to establish trustlines and perform swaps."
  },
  {
    question: "Is CODY Token an investment?",
    answer: "No, CODY Token is not an investment vehicle and offers no promises of return. It&apos;s a utility token designed for fan engagement, merchandise access, and community participation within the CODY ecosystem."
  },
  {
    question: "What can I do with CODY Token?",
    answer: "CODY Token can be used for exclusive merchandise purchases, event access, gaming rewards, future NFT drops, and community voting. It&apos;s designed to enhance fan engagement with Cody Cordova&apos;s multimedia universe."
  },
  {
    question: "How do I establish a trustline to CODY?",
    answer: (
      <>
        In your Stellar wallet, search for &apos;CODY&apos; and add the asset with issuer address:{' '}
        <AddressDisplay address="GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" />. A small XLM reserve is required by the network.
      </>
    )
  },
  {
    question: "Is CODY Token safe?",
    answer: "Yes, CODY Token is built on the secure Stellar blockchain with transparent, verifiable transactions. All token operations are recorded on the public ledger, and the issuer address is publicly verified."
  },
  {
    question: "Can I use CODY Token on my phone?",
    answer: "Yes, you can use CODY Token through mobile Stellar wallets like Lobstr, which are available on iOS and Android. The token works seamlessly across all Stellar-compatible mobile applications."
  },
  {
    question: "What's the difference between CODY Token and other cryptocurrencies?",
    answer: "CODY Token is specifically designed for fan engagement and creator economy use cases, built on Stellar&apos;s fast and low-cost network. Unlike speculative tokens, it focuses on utility within the CODY ecosystem."
  },
  {
    question: "How can I stay updated on CODY Token news?",
    answer: "Follow @realcodycordova on Twitter, join our Telegram group, and check the blog section for updates. All official announcements are made through verified channels."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="page-section">
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know about CODY Token</p>
        
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${openItems.includes(index) ? 'active' : ''}`}
            >
              <div 
                className="faq-question"
                onClick={() => toggleItem(index)}
              >
                <span>{item.question}</span>
                <span className="faq-icon">+</span>
              </div>
              <div className={`faq-answer ${openItems.includes(index) ? 'show' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
