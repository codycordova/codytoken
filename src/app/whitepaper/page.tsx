import React from 'react';
import './Whitepaper.css';
import Footer from '@/components/Footer';

export default function WhitepaperPage() {
  return (
    <div className="page-wrapper">
      <main className="main-content">
        <div className="whitepaper-container">
          <h1>CODY Token Whitepaper</h1>

          <h2>Abstract</h2>
          <p>
            The CODY Token is a custom asset built on the Stellar Blockchain to support the ecosystem of music producer and multimedia artist Cody Cordova. Designed to function as a decentralized, utility-based token within the realms of music, gaming, art, and community economics, CODY Token introduces a practical implementation of blockchain technology tailored to creator-led digital economies. This whitepaper outlines the rationale, methodology, and vision behind CODY Token, its economic model, and its multi-phase distribution strategy.
          </p>

          <h2>Introduction</h2>
          <p>
            The CODY Token project officially began on <strong>June 6th, 2023</strong>, with the goal of creating a native digital currency that enables seamless fan interaction, incentivized participation, and blockchain-powered ownership in Cody Cordova&apos;s multimedia universe. By leveraging Stellar&apos;s low transaction fees and decentralized architecture, CODY Token serves as a backbone for trading, merch access, event participation, and in-app gaming rewards.
          </p>

          <h2>Tokenomics</h2>
          <ul>
            <li><strong>Asset Code:</strong> <code>CODY</code></li>
            <li><strong>Issuer Address:</strong> <code>GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK</code></li>
            <li><strong>Network:</strong> Stellar Public Network</li>
            <li><strong>Total Supply:</strong> 444,444,444,444 CODY</li>
            <li><strong>Decimals:</strong> 2</li>
          </ul>
          <p>
            To prevent dilution and ensure long-term scalability, the token release has been deliberately throttled. As of the time of publication, <strong>only 1,016 CODY tokens</strong> have been released into the public domain.
          </p>

          <h2>Research and Controlled Circulation</h2>
          <p>
            Unlike many meme or community tokens which experience early over-saturation, CODY Token has undergone a <strong>data-driven launch phase</strong>. Since June 2023, we have implemented controlled micro-distribution of 1,016 tokens to test real-world behavior, holder psychology, liquidity efficiency, and market volatility under various conditions.
          </p>
          <p>
            This approach allowed us to:
          </p>
          <ul>
            <li>Monitor behavioral economics surrounding a perceived scarce digital asset.</li>
            <li>Collect longitudinal liquidity data on decentralized Stellar exchanges.</li>
            <li>Observe wallet engagement trends across various demographic clusters.</li>
            <li>Assess the impact of micro-supply theory in hyper-niche blockchain markets.</li>
          </ul>
          <p>
            The insights gathered over this extended pilot window provide a <strong>scientific and statistical foundation</strong> for continued rollout strategies, including game integrations, airdrop pacing, and liquidity pair modeling.
          </p>

          <h2>Use Cases</h2>
          <ul>
            <li><strong>Merchandise &amp; Ticketing:</strong> Redeemable for exclusive CODY Cordova gear and event access.</li>
            <li><strong>Play-to-Earn Ecosystem:</strong> Used within future web-based RPGs and creative mini-games.</li>
            <li><strong>Staking &amp; DAO Voting (planned):</strong> Long-term holders can stake for voting power or passive rewards.</li>
            <li><strong>Digital Collectibles:</strong> Enables minting and purchasing of limited-edition NFT drops.</li>
          </ul>

          <h2>Vision</h2>
          <p>
            CODY Token represents the convergence of blockchain, art, community, and psychology. Through phased releases, user feedback, and adaptive development, the token is designed not as a speculative financial instrument, but as a <em>participatory gateway</em> into the evolving CODYverse.
          </p>
          <p>
            This project is inherently experimental—a science-meets-culture sandbox for self-sovereign creators and fans alike.
          </p>

          <h2>Compliance &amp; Integrity</h2>
          <ul>
            <li><strong>Not a security:</strong> CODY Token is not an investment vehicle and offers no promises of return.</li>
            <li><strong>Transparency:</strong> All issuance and distribution is visible via Stellar public ledger.</li>
            <li><strong>Stellar TOML Compliant:</strong> Fully verified asset metadata at <a href="https://codytoken.com/.well-known/stellar.toml" target="_blank" rel="noopener noreferrer">https://codytoken.com/.well-known/stellar.toml</a>.</li>
          </ul>

          <h2>Conclusion</h2>
          <p>
            By applying rigorous experimentation and deliberate scarcity, CODY Token has already begun building a trusted, data-backed foundation. As we expand into gaming, NFTs, and decentralized tools for fans and creatives, the token remains a cultural experiment powered by love, art, and open-source tech.
          </p>

          <p><em>Stay tuned for Phase 2.</em></p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 