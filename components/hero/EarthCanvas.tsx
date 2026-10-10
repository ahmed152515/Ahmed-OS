'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ===== CONFIGURATION =====
const CONFIG = {
  // Colors
  backgroundColor: '#050a07',
  landColorStart: '#4ade80',
  landColorEnd: '#86efac',
  atmosphereColor: '#34d399',
  arcColor: '#4ade80',
  nodeColor: '#c8ff5a',
  
  // Sizes
  globeRadius: 4,
  dotCount: 5000,
  starCount: 600,
  
  // Animation
  rotationSpeed: 0.001, // ~60s per revolution (faster, more visible)
  arcSpeed: 0.002,
  
  // Performance
  maxPixelRatio: 2,
  atmosphereOpacity: 0.25,
  
  // Cities for arcs (lat, lon)
  cities: [
    { name: 'Karachi', lat: 24.86, lon: 67.00 },
    { name: 'London', lat: 51.50, lon: -0.12 },
    { name: 'San Francisco', lat: 37.77, lon: -122.41 },
    { name: 'Singapore', lat: 1.35, lon: 103.81 },
    { name: 'Dubai', lat: 25.20, lon: 55.27 },
  ],
};

// Procedural land mask using noise-like distribution
function generateLandDots(count: number, radius: number): THREE.Vector3[] {
  const dots: THREE.Vector3[] = [];
  const landRegions = [
    // North America
    { lat: 40, lon: -100, spread: 25 },
    { lat: 50, lon: -80, spread: 15 },
    // South America
    { lat: -15, lon: -60, spread: 20 },
    // Europe
    { lat: 50, lon: 10, spread: 15 },
    // Africa
    { lat: 0, lon: 20, spread: 25 },
    { lat: -25, lon: 25, spread: 15 },
    // Asia
    { lat: 40, lon: 100, spread: 30 },
    { lat: 30, lon: 80, spread: 20 },
    { lat: 55, lon: 90, spread: 15 },
    // Australia
    { lat: -25, lon: 135, spread: 15 },
  ];

  for (let i = 0; i < count; i++) {
    // Pick a random land region
    const region = landRegions[Math.floor(Math.random() * landRegions.length)];
    
    // Add randomness around region center
    const lat = region.lat + (Math.random() - 0.5) * region.spread;
    const lon = region.lon + (Math.random() - 0.5) * region.spread;
    
    // Convert to Cartesian
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    dots.push(new THREE.Vector3(x, y, z));
  }
  
  return dots;
}

// Convert lat/lon to Cartesian
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

export default function EarthCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const globeRef = useRef<THREE.Group | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    // Scene setup with tone mapping
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.backgroundColor);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    camera.position.y = 1;
    cameraRef.current = camera;

    // Renderer setup with tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.maxPixelRatio));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(CONFIG.backgroundColor, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeRef.current = globeGroup;

    // Generate land dots
    const landDots = generateLandDots(CONFIG.dotCount, CONFIG.globeRadius);
    
    const dotGeometry = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(landDots.length * 3);
    const dotColors = new Float32Array(landDots.length * 3);
    
    const colorStart = new THREE.Color(CONFIG.landColorStart);
    const colorEnd = new THREE.Color(CONFIG.landColorEnd);
    
    for (let i = 0; i < landDots.length; i++) {
      dotPositions[i * 3] = landDots[i].x;
      dotPositions[i * 3 + 1] = landDots[i].y;
      dotPositions[i * 3 + 2] = landDots[i].z;
      
      // Random color between start and end
      const t = Math.random();
      const color = colorStart.clone().lerp(colorEnd, t);
      
      // Slight brightness variation
      const brightness = 0.8 + Math.random() * 0.4;
      dotColors[i * 3] = color.r * brightness;
      dotColors[i * 3 + 1] = color.g * brightness;
      dotColors[i * 3 + 2] = color.b * brightness;
    }
    
    dotGeometry.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    dotGeometry.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
    
    const dotMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    
    const dots = new THREE.Points(dotGeometry, dotMaterial);
    globeGroup.add(dots);

    // Atmosphere glow with Fresnel effect
    const atmosphereGeometry = new THREE.SphereGeometry(CONFIG.globeRadius * 1.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(CONFIG.atmosphereColor) },
        viewVector: { value: new THREE.Vector3() },
        opacity: { value: CONFIG.atmosphereOpacity },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float opacity;
        uniform vec3 viewVector;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(glowColor, intensity * opacity);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphere);

    // Create city arcs
    const arcGroup = new THREE.Group();
    const cityPairs = [
      [0, 1], // Karachi to London
      [1, 2], // London to San Francisco
      [2, 3], // San Francisco to Singapore
      [3, 4], // Singapore to Dubai
      [4, 0], // Dubai to Karachi
    ];
    
    const nodes: THREE.Mesh[] = [];
    
    cityPairs.forEach(([startIdx, endIdx]) => {
      const startCity = CONFIG.cities[startIdx];
      const endCity = CONFIG.cities[endIdx];
      
      const startPos = latLonToVector3(startCity.lat, startCity.lon, CONFIG.globeRadius * 1.05);
      const endPos = latLonToVector3(endCity.lat, endCity.lon, CONFIG.globeRadius * 1.05);
      
      // Create curved path
      const controlPos = startPos.clone().add(endPos).multiplyScalar(0.5).normalize().multiplyScalar(CONFIG.globeRadius * 1.2);
      
      const curve = new THREE.QuadraticBezierCurve3(startPos, controlPos, endPos);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const material = new THREE.LineBasicMaterial({
        color: CONFIG.arcColor,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      });
      
      const arc = new THREE.Line(geometry, material);
      arcGroup.add(arc);
      
      // Add pulsing nodes at cities
      [startPos, endPos].forEach((pos, idx) => {
        const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: CONFIG.nodeColor,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(pos);
        arcGroup.add(node);
        nodes.push(node);
      });
    });
    
    globeGroup.add(arcGroup);

    // Orbit rings
    const rings: THREE.Mesh[] = [];
    
    for (let i = 0; i < 2; i++) {
      const ringGeometry = new THREE.RingGeometry(
        CONFIG.globeRadius * 1.3 + i * 0.5,
        CONFIG.globeRadius * 1.3 + i * 0.5 + 0.015,
        128
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: CONFIG.arcColor,
        transparent: true,
        opacity: 0.1 - i * 0.03,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2 + (i * 0.3);
      ring.rotation.y = i * 0.4;
      globeGroup.add(ring);
      rings.push(ring);
    }

    // Star particles
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(CONFIG.starCount * 3);
    
    for (let i = 0; i < CONFIG.starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = CONFIG.globeRadius * 2 + Math.random() * 4;
      
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: CONFIG.landColorStart,
      size: 0.015,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      timeRef.current += 0.016; // ~60fps

      // Rotate globe smoothly
      if (globeGroup) {
        globeGroup.rotation.y += CONFIG.rotationSpeed;
      }

      // Rotate stars slowly in opposite direction
      stars.rotation.y -= CONFIG.rotationSpeed * 0.3;

      // Animate orbit rings with slight wobble
      rings.forEach((ring, i) => {
        ring.rotation.z = Math.sin(timeRef.current * 0.2 + i) * 0.05;
      });

      // Pulse the city nodes
      nodes.forEach((node, i) => {
        const pulse = Math.sin(timeRef.current * 2 + i * 0.5) * 0.3 + 0.7;
        (node.material as THREE.MeshBasicMaterial).opacity = pulse * 0.8;
      });

      // Update atmosphere
      if (atmosphereMaterial.uniforms) {
        atmosphereMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
          camera.position,
          globeGroup.position
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    // Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
          } else if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(containerRef.current);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
      
      dotGeometry.dispose();
      dotMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    />
  );
}
