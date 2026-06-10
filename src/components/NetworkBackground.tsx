import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export default function NetworkBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    // Define color palette from SILA's visual theme (blue, gold/amber, and subtle white/slate)
    const colors = [
      'rgba(59, 130, 246, 0.35)', // Blue-500 with mid opacity
      'rgba(245, 158, 11, 0.25)',  // Amber-500 with mid opacity
      'rgba(226, 232, 240, 0.25)', // Slate-200 with mid opacity
    ];

    // Initialize particles based on screen size
    const initParticles = (w: number, h: number) => {
      // Density of particles depends on surface area
      const count = Math.min(Math.floor((w * h) / 18000), 120);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          // Very slow, professional movement
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.5 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    // Responsive Canvas Resizing using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        let { width: newWidth, height: newHeight } = entry.contentRect;
        
        // Ensure accurate pixel values on high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        
        // Debounce/guard against zero dimension updates
        if (newWidth === 0 || newHeight === 0) {
          const rect = container.getBoundingClientRect();
          newWidth = rect.width;
          newHeight = rect.height;
        }

        width = newWidth;
        height = newHeight;
        
        canvas.width = newWidth * dpr;
        canvas.height = newHeight * dpr;
        
        ctx.scale(dpr, dpr);
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;

        initParticles(newWidth, newHeight);
      }
    });

    resizeObserver.observe(container);

    // Frame update and interactive render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Move and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wall-bouncing boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Keep inside bounds if resized
        if (p.x < 0) p.x = 0;
        if (p.x > width) p.x = width;
        if (p.y < 0) p.y = 0;
        if (p.y > height) p.y = height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // 2. Draw connections (lines between nearby particles)
      const maxDistance = 145;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Stronger opacity for closer connections
            const alpha = (1 - dist / maxDistance) * 0.12;
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Subtle digital grid line connecting the entities
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.unobserve(container);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 opacity-40 mix-blend-screen"
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
}
