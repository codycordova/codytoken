import React from 'react';

interface GraffitiHeroTextProps {
  text: string;
  fontSize?: number;
  width?: number;
  height?: number;
  className?: string;
}

export default function GraffitiHeroText({
  text,
  fontSize = 72,
  width = 700,
  height,
  className = '',
}: GraffitiHeroTextProps) {
  const svgHeight = height || fontSize * 1.5;
  return (
    <svg
      width="100%"
      height={svgHeight}
      viewBox={`0 0 ${width} ${svgHeight}`}
      className={className}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="graff-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffea00" />
          <stop offset="100%" stopColor="#ff00cc" />
        </linearGradient>
        <filter id="graff-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.7"/>
        </filter>
      </defs>
      <text
        x="50%"
        y={fontSize}
        textAnchor="middle"
        fontFamily="'Urban Jungle', Impact, sans-serif"
        fontSize={fontSize}
        fill="url(#graff-fill)"
        stroke="#222"
        strokeWidth="10"
        filter="url(#graff-shadow)"
        style={{ paintOrder: 'stroke fill', letterSpacing: 2 }}
        dominantBaseline="middle"
      >
        {text}
      </text>
      {/* Example paint splatter (can add more or randomize) */}
      <circle cx={width * 0.2} cy={svgHeight * 0.8} r="12" fill="#ffea00" opacity="0.7" />
      <ellipse cx={width * 0.7} cy={svgHeight * 0.6} rx="18" ry="7" fill="#ff00cc" opacity="0.5" />
      <circle cx={width * 0.5} cy={svgHeight * 0.95} r="7" fill="#fff" opacity="0.4" />
    </svg>
  );
} 