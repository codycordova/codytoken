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
  // Apply gradient for yellow color to match desktop
  const isGradient = color === '#ffea00';
  
  return (
    <div 
      className={`mobile-hero-text ${className}`}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: '700',
        color: isGradient ? undefined : color,
        background: isGradient ? 'linear-gradient(45deg, #ffea00, #ffd700)' : undefined,
        WebkitBackgroundClip: isGradient ? 'text' : undefined,
        WebkitTextFillColor: isGradient ? 'transparent' : undefined,
        backgroundClip: isGradient ? 'text' : undefined,
        textAlign: 'center',
        lineHeight: '1.2',
        textShadow: isGradient ? '0 4px 8px rgba(0, 0, 0, 0.7)' : '0 4px 8px rgba(0, 0, 0, 0.5)',
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