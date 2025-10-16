"use client";
import React from 'react';
import Footer from '@/components/Footer';
import AddressDisplay from '@/components/AddressDisplay';

export default function WhitepaperPage() {
  const [lastUpdated, setLastUpdated] = React.useState<string>('');
  React.useEffect(() => {
    // Use build time or current time to display freshness
    const now = new Date();
    setLastUpdated(now.toISOString());
  }, []);
  return (
    <div className="text-page">
      <main className="main-content">
        <div className="whitepaper-container">
          <h1>CODY Token Whitepaper</h1>
          {lastUpdated ? (
            <p>
              <small>
                Last updated: <time dateTime={lastUpdated}>{new Date(lastUpdated).toLocaleString()}</time>
              </small>
            </p>
          ) : null}

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
            <li><strong>Issuer Address:</strong> <AddressDisplay address="GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK" /></li>
            <li><strong>Network:</strong> Stellar Public Network</li>
            <li><strong>Total Supply:</strong> 444,444,444,444 CODY</li>
            <li><strong>Decimals:</strong> 2</li>
          </ul>
          <p>
            To prevent dilution and ensure long-term scalability, the token release has been deliberately throttled. As of
            <span> </span>
            {lastUpdated ? (
              <time dateTime={lastUpdated}><strong>{new Date(lastUpdated).toLocaleDateString()}</strong></time>
            ) : (
              <strong>now</strong>
            )}
            , <strong>2,000 CODY tokens</strong> have been released into the public domain.
          </p>
          <p>
            A second release of <strong>870.78 CODY</strong> was contributed to the AQUA Network&apos;s <strong>CODY/USDC</strong> liquidity pool to reach a circulating total of <strong>2,000 CODY</strong>.
            <span> </span>
            <em>
              Reference snapshot:
              <span> </span>
              {lastUpdated ? (
                <time dateTime={lastUpdated}>{new Date(lastUpdated).toLocaleString()}</time>
              ) : 'current'}
            </em>
            . Reference: <a href="https://stellar.expert/explorer/public/contract/CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU" target="_blank" rel="noopener noreferrer">Stellar Expert contract</a>.
          </p>

          <h2>Research and Controlled Circulation</h2>
          <p>
            Unlike many meme or community tokens which experience early over-saturation, CODY Token has undergone a <strong>data-driven launch phase</strong>. Since June 2023, we have implemented controlled micro-distribution of 2,000 tokens to test real-world behavior, holder psychology, liquidity efficiency, and market volatility under various conditions.
          </p>
          <h3>Distribution History</h3>
          <ul>
            <li><strong>1,129.22 CODY</strong> initial market float across DEX traders and test distributions.</li>
            <li><strong>+870.78 CODY</strong> added to AQUA <strong>CODY/USDC</strong> liquidity pool (friend-assisted). Reference: <a href="https://stellar.expert/explorer/public/contract/CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU" target="_blank" rel="noopener noreferrer">Stellar Expert contract</a>.</li>
            <li><strong>= 2,000 CODY</strong> total currently live in circulation.</li>
          </ul>
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