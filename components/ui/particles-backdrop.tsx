"use client";

import { useEffect, useRef } from "react";

interface ParticlesBackdropProps {
  quantity?: number;
  staticity?: boolean;
  ease?: number;
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  color: string;
}

export function ParticlesBackdrop({
  quantity = 80,
  staticity = false,
  ease = 50,
}: ParticlesBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const circlesRef = useRef<Circle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    contextRef.current = context;

    const handleResize = () => {
      if (!canvas) return;
      const { width, height } = canvas.parentElement?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      canvasSizeRef.current = { w: width, h: height };
      context.scale(dpr, dpr);
      initCircles();
    };

    const initCircles = () => {
      circlesRef.current = [];
      const w = canvasSizeRef.current.w;
      const h = canvasSizeRef.current.h;
      for (let i = 0; i < quantity; i++) {
        circlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          translateX: 0,
          translateY: 0,
          size: Math.random() * 1.5 + 0.5,
          alpha: 0,
          targetAlpha: Math.random() * 0.4 + 0.1,
          dx: (Math.random() - 0.5) * 0.15,
          dy: (Math.random() - 0.5) * 0.15,
          color: i % 2 === 0 ? "rgba(109, 40, 217, " : "rgba(37, 99, 235, ", // Violet or Blue
        });
      }
    };

    const drawCircle = (circle: Circle) => {
      const ctx = contextRef.current;
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(
        circle.x + circle.translateX,
        circle.y + circle.translateY,
        circle.size,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = `${circle.color}${circle.alpha})`;
      ctx.fill();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    let animationFrameId: number;

    const animate = () => {
      const ctx = contextRef.current;
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h);

      circlesRef.current.forEach((circle) => {
        // Handle fading in particles
        if (circle.alpha < circle.targetAlpha) {
          circle.alpha += 0.005;
        }

        // Mouse effect (push/pull relative to center coordinates)
        if (!staticity) {
          const mouseX = mouseRef.current.x;
          const mouseY = mouseRef.current.y;
          const dx = mouseX - circle.x;
          const dy = mouseY - circle.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 200) {
            const force = (200 - dist) / 200;
            // Ease translateX towards force
            circle.translateX += (dx * force * -0.05 - circle.translateX) / ease;
            circle.translateY += (dy * force * -0.05 - circle.translateY) / ease;
          } else {
            circle.translateX += (0 - circle.translateX) / ease;
            circle.translateY += (0 - circle.translateY) / ease;
          }
        }

        // Drift values
        circle.x += circle.dx;
        circle.y += circle.dy;

        // Wrap around bounds
        if (circle.x < 0) circle.x = canvasSizeRef.current.w;
        if (circle.x > canvasSizeRef.current.w) circle.x = 0;
        if (circle.y < 0) circle.y = canvasSizeRef.current.h;
        if (circle.y > canvasSizeRef.current.h) circle.y = 0;

        drawCircle(circle);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [quantity, staticity, ease]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
    />
  );
}
