
import React, { useEffect, useRef } from 'react';

const PixelBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Grid configuration
    const gridSize = 20;
    const dotSize = 1;
    const colors = ['#39FF14', '#9B30FF', '#00FFFF', '#FF00FF', '#1E90FF'];
    
    // Random stars
    const stars: { x: number; y: number; size: number; color: string; pulse: number; pulseSpeed: number }[] = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 10000);
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }
    
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.fillStyle = 'rgba(155, 48, 255, 0.05)';
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.fillRect(x, y, dotSize, dotSize);
        }
      }
      
      // Draw stars
      stars.forEach(star => {
        star.pulse += star.pulseSpeed;
        const scale = (Math.sin(star.pulse) + 1) * 0.5 + 0.5;
        
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 0.1 + scale * 0.3;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    const animate = () => {
      drawGrid();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default PixelBackground;
