'use client';

import { useEffect, useState } from 'react';

// ===== CONFIGURATION =====
const CONFIG = {
  // Colors
  accentColor: '#4ade80',
  textColor: '#6b7280',
  
  // Typography
  monoFont: 'var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  
  // Animation
  scanlineInterval: 8000, // ms
};

export default function HUD() {
  const [time, setTime] = useState('');
  const [scanlinePosition, setScanlinePosition] = useState(0);

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate scanline
    const animateScanline = () => {
      setScanlinePosition(prev => (prev + 1) % 100);
    };

    const interval = setInterval(animateScanline, CONFIG.scanlineInterval / 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Bottom left: SYS ONLINE + clock */}
      <div
        className="absolute bottom-6 left-6 flex items-center gap-4 text-xs"
        style={{ fontFamily: CONFIG.monoFont, color: CONFIG.textColor, zIndex: 20 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
          <span>SYS ONLINE</span>
        </div>
        <span className="opacity-50">|</span>
        <span>{time}</span>
      </div>

      {/* Bottom right: scroll cue */}
      <div
        className="absolute bottom-6 right-6 flex items-center gap-2 text-xs"
        style={{ fontFamily: CONFIG.monoFont, color: CONFIG.textColor, zIndex: 20 }}
      >
        <span className="opacity-50">SCROLL</span>
        <div className="flex flex-col gap-1">
          <div className="w-1 h-1 bg-[#4ade80]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-[#4ade80]/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        </div>
      </div>

      {/* Scanline sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(74,222,128,0.03) 50%, transparent 100%)',
          transform: `translateY(${scanlinePosition}%)`,
          transition: 'transform 8s linear',
          zIndex: 5,
        }}
      />
    </>
  );
}
