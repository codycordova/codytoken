"use client";
import React from 'react';
import './Tokenomics.css';
import Footer from '@/components/Footer';

export default function TokenomicsPage() {
  const [circulating, setCirculating] = React.useState<string>('Loading…');
  const [source, setSource] = React.useState<string>('');
  // LP section removed

  React.useEffect(() => {
    let mounted = true;
    fetch('/api/tokenomics', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (!mounted) return;
        const val = typeof data.circulatingSupply === 'number'
          ? data.circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 2 })
          : 'N/A';
        setCirculating(val);
        setSource(data.source || '');
      })
      .catch(() => {
        if (!mounted) return;
        setCirculating('N/A');
      });
    return () => { mounted = false; };
  }, []);

  // LP section removed
  return (
    <div className="page-wrapper">
      <main className="main-content">
        <div className="tokenomics-container">
          <h1>Tokenomics</h1>

          <section>
            <h2>Supply Overview</h2>
            <ul>
              <li><strong>Total Supply:</strong> 444,444,444,444 CODY</li>
              <li><strong>Decimals:</strong> 2</li>
              <li><strong>Circulating (live released):</strong> <span id="circulating-value">{circulating}</span>{source ? <em> (from {source})</em> : null}</li>
            </ul>
          </section>

          <section>
            <h2>Release Timeline</h2>
            <ul>
              <li><strong>Initial float:</strong> 1,129.22 CODY distributed via DEX trading and test allocations</li>
              <li><strong>Second release:</strong> +870.78 CODY contributed to AQUA CODY/USDC LP (friend-assisted)</li>
              <li><strong>Current circulating total:</strong> 2,000 CODY</li>
            </ul>
            <p>
              Verification: <a href="https://stellar.expert/explorer/public/contract/CBN2N5L4UM5PPQE5UQNC3HVGT56TDQMAXMT3LVFMNN6XLFXZMCJY6KOU" target="_blank" rel="noopener noreferrer">Stellar Expert contract</a>
            </p>
            
          </section>

          <section>
            <h2>Asset Details</h2>
            <ul>
              <li><strong>Asset Code:</strong> <code>CODY</code></li>
              <li><strong>Issuer:</strong> <code>GAW55YAX46HLIDRONLOLUWP672HTFXW5WWTEI2T7OXVEFEDE5UKQDJAK</code></li>
              <li><strong>Network:</strong> Stellar Public Network</li>
              <li><strong>Stellar TOML:</strong> <a href="https://codytoken.com/.well-known/stellar.toml" target="_blank" rel="noopener noreferrer">codytoken.com/.well-known/stellar.toml</a></li>
            </ul>
          </section>

          
        </div>
      </main>
      <Footer />
    </div>
  );
}


