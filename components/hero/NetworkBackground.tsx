'use client';

import { useEffect, useRef } from 'react';

// ===== CONFIGURATION =====
const CONFIG = {
  // Colors
  backgroundColor: '#050a07',
  particleColor: '#4ade80',
  lineColor: '#4ade80',
  
  // Particle settings
  particleCount: 120, // Desktop
  mobileParticleCount: 50, // Mobile
  particleSize: 2,
  connectionDistance: 150,
  
  // Animation
  speed: 0.3,
  mouseInteractionRadius: 150,
  mouseForce: 0.05,
  
  // Depth layers
  layers: 3,
  depthOpacity: [0.3, 0.6, 1.0], // Opacity for each layer
  depthSize: [0.5, 0.75, 1.0], // Size multiplier for each layer
  
  // Performance
  maxPixelRatio: 2,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  layer: number;
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    // Check if mobile
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? CONFIG.mobileParticleCount : CONFIG.particleCount;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const layer = Math.floor(Math.random() * CONFIG.layers);
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * CONFIG.speed,
          vy: (Math.random() - 0.5) * CONFIG.speed,
          layer,
        });
      }
      particlesRef.current = particles;
    };
    initParticles();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (prefersReducedMotion) return;
      mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (prefersReducedMotion) {
        // Static fallback - just draw once
        if (animationFrameRef.current !== undefined) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      // Clear canvas with background color
      ctx.fillStyle = CONFIG.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.mouseInteractionRadius) {
          const force = (CONFIG.mouseInteractionRadius - distance) / CONFIG.mouseInteractionRadius;
          particle.x -= dx * force * CONFIG.mouseForce;
          particle.y -= dy * force * CONFIG.mouseForce;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const pdx = particle.x - other.x;
          const pdy = particle.y - other.y;
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pDistance < CONFIG.connectionDistance) {
            const opacity = (1 - pDistance / CONFIG.connectionDistance) * 
                           Math.min(CONFIG.depthOpacity[particle.layer], CONFIG.depthOpacity[other.layer]) * 0.3;
            
            ctx.beginPath();
            ctx.strokeStyle = CONFIG.lineColor;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw particle
        const size = CONFIG.particleSize * CONFIG.depthSize[particle.layer];
        const opacity = CONFIG.depthOpacity[particle.layer] * 0.6;
        
        ctx.beginPath();
        ctx.fillStyle = CONFIG.particleColor;
        ctx.globalAlpha = opacity;
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle glow to brighter particles
        if (particle.layer === CONFIG.layers - 1) {
          ctx.beginPath();
          ctx.fillStyle = CONFIG.particleColor;
          ctx.globalAlpha = 0.1;
          ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
