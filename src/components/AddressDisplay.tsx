"use client";

import React, { useState, useEffect } from 'react';

interface AddressDisplayProps {
  address: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AddressDisplay({ address, className, style }: AddressDisplayProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy address:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Truncate address for mobile
  const displayAddress = isMobile 
    ? `${address.slice(0, 11)}...${address.slice(-10)}`
    : address;

  return (
    <span
      className={className}
      style={{
        ...style,
        background: 'rgba(255, 234, 0, 0.1)',
        color: '#e0e0e0',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        fontFamily: 'Courier New, monospace',
        fontSize: '0.9rem',
        wordBreak: 'break-all',
        overflowWrap: 'break-word',
        maxWidth: '100%',
        display: 'inline-block',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid rgba(255, 234, 0, 0.2)',
        position: 'relative',
        ...(copied && {
          background: 'rgba(0, 255, 0, 0.1)',
          borderColor: 'rgba(0, 255, 0, 0.3)',
          color: '#90EE90'
        })
      }}
      onClick={copyToClipboard}
      title={copied ? 'Copied!' : 'Click to copy full address'}
    >
      {displayAddress}
      {copied && (
        <span
          style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#90EE90',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          ✓ Copied!
        </span>
      )}
    </span>
  );
}
