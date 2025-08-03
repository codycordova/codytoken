import React from 'react';

interface MobileHeroTextProps {
  text: string;
  fontSize?: number;
  className?: string;
  color?: string;
}

export default function MobileHeroText({
  text,
  fontSize = 48,
  className = '',
  color = '#ffffff'
}: MobileHeroTextProps) {
  return (
    <div 
      className={`mobile-hero-text ${className}`}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: '700',
        color: color,
        textAlign: 'center',
        lineHeight: '1.2',
        textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        margin: '0 auto',
        maxWidth: '90vw',
        padding: '0 20px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {text}
    </div>
  );
} 