'use client';

import { useEffect, useRef, useState } from 'react';
import NetworkBackground from './NetworkBackground';
import WalkerVideo from './WalkerVideo';
import HeroText from './HeroText';
import HUD from './HUD';

// ===== CONFIGURATION =====
const CONFIG = {
  // Colors
  backgroundColor: '#050a07',
  scrimColor: 'rgba(5, 10, 7, 0.85)',
  gridColor: 'rgba(74, 222, 128, 0.03)',
  
  // Layout
  maxWidth: '1400px',
  gridColumns: 12,
  textColumns: 5,
  stageColumns: 7,
  
  // Overlays
  grainOpacity: 0.04,
};

interface HeroProps {
  onAboutClick?: () => void;
  onAskClick?: () => void;
}

export default function Hero({ onAboutClick, onAskClick }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden" style={{ backgroundColor: CONFIG.backgroundColor }}>
      {/* Network background */}
      <NetworkBackground />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${CONFIG.gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${CONFIG.gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          zIndex: 1,
        }}
      />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
          opacity: CONFIG.grainOpacity,
          zIndex: 2,
        }}
      />

      {/* Main content - 12-column grid */}
      <div
        ref={containerRef}
        className="relative z-10 min-h-[100svh] max-w-[1400px] mx-auto px-6 md:px-12"
        style={{ zIndex: 10 }}
      >
        <div className="min-h-[100svh] grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Mobile: Text first, Desktop: Left 5 columns */}
          <div className="md:col-span-5 relative flex items-center order-1 md:order-1 py-8 md:py-0">
            {/* Dark gradient scrim behind text */}
            <div
              className="absolute inset-0 -left-12"
              style={{
                background: `linear-gradient(to right, ${CONFIG.scrimColor} 0%, transparent 100%)`,
                zIndex: -1,
              }}
            />
            
            <HeroText onAboutClick={onAboutClick} onAskClick={onAskClick} />
          </div>

          {/* Desktop: Right 7 columns - Video only on desktop */}
          <div className="hidden md:block md:col-span-7 relative h-full order-2 md:order-2">
            {/* Walker video - positioned in front, bottom-aligned */}
            <div 
              className="absolute inset-0 flex items-end justify-center"
              style={{ zIndex: 10, paddingBottom: '5%', background: 'transparent' }}
            >
              <WalkerVideo />
            </div>
          </div>
        </div>
      </div>

      {/* HUD overlay */}
      <HUD />
    </section>
  );
}
