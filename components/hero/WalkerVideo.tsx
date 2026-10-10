'use client';

import { useEffect, useRef, useState } from 'react';

// ===== CONFIGURATION =====
const CONFIG = {
  // Video paths
  videoPath: '/miai_bg_remover-1791664340000-nobg.webm',
  
  // Animation
  entranceScale: 0.7,
  entranceDuration: 1200, // ms
  scrollScaleMultiplier: 1.25,
  blurAmount: 3, // px
  
  // Parallax
  parallaxIntensityWalker: 5, // px
  disableParallaxOnTouch: true,
  
  // Lighting
  dropShadow: '0 30px 40px rgba(0,0,0,.6)',
  rimLight: '0 0 12px rgba(74,222,128,.35)',
  
  // Size
  stageHeightPercent: 0.85,
};

export default function WalkerVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState(CONFIG.entranceScale);
  const [blur, setBlur] = useState(CONFIG.blurAmount);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    // Load video
    const handleLoad = () => {
      setIsLoaded(true);
      
      // Entrance animation
      if (!prefersReducedMotion) {
        const startTime = performance.now();
        
        const animateEntrance = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / CONFIG.entranceDuration, 1);
          
          const eased = 1 - Math.pow(1 - progress, 3);
          
          setScale(CONFIG.entranceScale + (1 - CONFIG.entranceScale) * eased);
          setBlur(CONFIG.blurAmount * (1 - eased));
          setOpacity(eased);
          
          if (progress < 1) {
            requestAnimationFrame(animateEntrance);
          }
        };
        
        requestAnimationFrame(animateEntrance);
      } else {
        setScale(1);
        setBlur(0);
        setOpacity(1);
      }
    };

    // Try to play video with retry logic
    const attemptPlay = async (retryCount = 0) => {
      try {
        await video.play();
      } catch (error) {
        if (retryCount < 3) {
          setTimeout(() => attemptPlay(retryCount + 1), 1000);
        } else {
          console.error('Video autoplay failed after retries:', error);
        }
      }
    };

    video.addEventListener('loadeddata', handleLoad);
    attemptPlay();

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) return;

      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      const newScale = 1 + (CONFIG.scrollScaleMultiplier - 1) * scrollProgress;
      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (CONFIG.disableParallaxOnTouch && isTouchDevice) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const animateParallax = () => {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      if (container) {
        const translateX = currentX * CONFIG.parallaxIntensityWalker;
        const translateY = currentY * CONFIG.parallaxIntensityWalker;
        container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      }

      requestAnimationFrame(animateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animateParallax();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scale]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-end justify-center"
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px) ${CONFIG.dropShadow} ${CONFIG.rimLight}`,
        zIndex: 10,
        background: 'transparent',
        backgroundColor: 'transparent',
      }}
    >
      {/* Walking video */}
      <video
        ref={videoRef}
        src={CONFIG.videoPath}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        className="object-contain"
        style={{
          maxHeight: `${CONFIG.stageHeightPercent * 100}%`,
          maxWidth: '100%',
          filter: 'brightness(1.1) contrast(1.05)',
          background: 'transparent',
          backgroundColor: 'transparent',
        }}
        aria-label="Walking figure animation"
      />
      
      {/* Floor line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4ade80]/30 to-transparent"
        style={{ bottom: '5%' }}
      />
      
      {/* Contact shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          bottom: '3%',
        }}
      />
      
      {/* Glowing floor ellipse */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-20 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(74,222,128,0.15) 0%, transparent 70%)',
          bottom: '2%',
        }}
      />
    </div>
  );
}
