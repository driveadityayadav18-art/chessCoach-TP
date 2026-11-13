'use client';

import React from 'react';
import './ShinyText.css';

export interface ShinyTextProps {
  text: string;
  className?: string;
  hoverOnly?: boolean;
  speedSec?: number;
  tone?: 'ink' | 'muted';
}

export default function ShinyText({
  text,
  className = '',
  hoverOnly = true,
  speedSec = 2.8,
  tone = 'muted',
}: ShinyTextProps) {
  return (
    <span
      className={`kiln-shiny-text ${
        tone === 'ink' ? 'kiln-shiny-text--ink' : ''
      } ${hoverOnly ? 'kiln-shiny-text--hover' : 'kiln-shiny-text--always'} ${className}`.trim()}
      style={{ '--shiny-duration': `${speedSec}s` } as React.CSSProperties}
    >
      {text}
    </span>
  );
}
