'use client';

import { useEffect, useState } from 'react';
import WalkerVideo from './WalkerVideo';

// ===== CONFIGURATION =====
const CONFIG = {
  // Colors
  accentColor: '#4ade80',
  accentHover: '#c8ff5a',
  textColor: '#e5e5e5',
  mutedColor: '#6b7280',
  
  // Typography
  headingFont: 'var(--font-bricolage-grotesque), var(--font-space-grotesk), system-ui, sans-serif',
  monoFont: 'var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  
  // Spacing
  sectionPadding: '2rem',
  
  // Animation delays (ms)
  staggerDelay: 80,
  
  // Typography sizes
  nameSize: 'clamp(56px, 8vw, 128px)',
  nameWeight: 800,
  nameLetterSpacing: '-0.04em',
};

interface HeroTextProps {
  onAboutClick?: () => void;
  onAskClick?: () => void;
}

export default function HeroText({ onAboutClick, onAskClick }: HeroTextProps) {
  const [showElements, setShowElements] = useState({
    label: false,
    name: false,
    title: false,
    stack: false,
    tagline: false,
    supporting: false,
    buttons: false,
  });

  useEffect(() => {
    const delays = {
      label: 0,
      name: CONFIG.staggerDelay * 2,
      title: CONFIG.staggerDelay * 4,
      stack: CONFIG.staggerDelay * 6,
      tagline: CONFIG.staggerDelay * 8,
      supporting: CONFIG.staggerDelay * 10,
      buttons: CONFIG.staggerDelay * 12,
    };

    Object.entries(delays).forEach(([key, delay]) => {
      setTimeout(() => {
        setShowElements(prev => ({ ...prev, [key]: true }));
      }, delay);
    });
  }, []);

  const handleAboutClick = () => {
    if (onAboutClick) onAboutClick();
  };

  const handleAskClick = () => {
    if (onAskClick) onAskClick();
  };

  return (
    <div className="flex flex-col justify-center h-full">
      {/* Top label with status dot */}
      <div
        className={`flex items-center gap-2 mb-6 transition-all duration-700 ${
          showElements.label ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ fontFamily: CONFIG.monoFont }}
      >
        <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
        <span className="text-xs tracking-widest text-[#4ade80]">
          AhmedOS // Agent Runtime
        </span>
      </div>

      {/* Name with gradient */}
      <h1
        className={`mb-4 transition-all duration-700 ${
          showElements.name ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{
          fontFamily: CONFIG.headingFont,
          fontSize: CONFIG.nameSize,
          fontWeight: CONFIG.nameWeight,
          letterSpacing: CONFIG.nameLetterSpacing,
          background: 'linear-gradient(to right, #ffffff, #c8ff5a)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        AHMED ABBAS
      </h1>

      {/* Title */}
      <p
        className={`text-xl md:text-2xl text-[#4ade80] mb-4 transition-all duration-700 ${
          showElements.title ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ fontFamily: CONFIG.headingFont }}
      >
        Full Stack AI Engineer
      </p>

      {/* Stack line */}
      <p
        className={`text-sm md:text-base text-gray-400 mb-6 transition-all duration-700 ${
          showElements.stack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ fontFamily: CONFIG.monoFont }}
      >
        React · Cloudflare · Generative AI
      </p>

      {/* Tagline */}
      <p
        className={`text-lg md:text-xl text-gray-300 mb-4 transition-all duration-700 ${
          showElements.tagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ fontFamily: CONFIG.headingFont }}
      >
        I build software, AI systems and products end-to-end.
      </p>

      {/* Supporting line */}
      <p
        className={`text-sm md:text-base text-gray-500 mb-8 italic transition-all duration-700 ${
          showElements.supporting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ fontFamily: CONFIG.headingFont }}
      >
        This isn't a portfolio that tells you about me. It's a system that lets you investigate me.
      </p>

      {/* Buttons */}
      <div
        className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${
          showElements.buttons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <button
          onClick={handleAboutClick}
          className="px-8 py-3 border border-[#4ade80] text-[#4ade80] font-bold rounded hover:bg-[#4ade80]/10 transition-all duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:ring-offset-2 focus:ring-offset-[#050a07]"
          style={{ fontFamily: CONFIG.headingFont }}
        >
          About Me
        </button>
        <button
          onClick={handleAskClick}
          className="group px-8 py-3 bg-[#4ade80] text-black font-bold rounded hover:bg-[#c8ff5a] transition-all duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:ring-offset-2 focus:ring-offset-[#050a07] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_30px_rgba(74,222,128,0.5)]"
          style={{ fontFamily: CONFIG.headingFont }}
        >
          Ask my portfolio
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>

      {/* Mobile video - only visible on mobile, below buttons */}
      <div className="md:hidden relative h-[40svh] mt-8">
        <WalkerVideo />
      </div>
    </div>
  );
}
