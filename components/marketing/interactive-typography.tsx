"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

const LETTERS = ["Z", "O", "R", "V", "A", "T", "E"];

function TypographicLetter({
  char,
  mousePos,
  containerRef,
  isReducedMotion,
}: {
  char: string;
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  isReducedMotion: boolean | null;
}) {
  const letterRef = useRef<HTMLDivElement>(null);

  // Physics spring values for subtle displacement
  const springConfig = { stiffness: 120, damping: 18, mass: 0.6 };
  const dx = useSpring(0, springConfig);
  const dy = useSpring(0, springConfig);
  const rotate = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  useEffect(() => {
    if (isReducedMotion || !letterRef.current || !containerRef.current) {
      dx.set(0);
      dy.set(0);
      rotate.set(0);
      scale.set(1);
      return;
    }

    const rect = letterRef.current.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2;
    const letterCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(mousePos.x - letterCenterX, mousePos.y - letterCenterY);
    const radius = 240; // Proximity threshold in pixels

    if (dist < radius && mousePos.x !== 0 && mousePos.y !== 0) {
      // Calculate normalized vector from cursor to letter center
      const power = Math.pow((radius - dist) / radius, 1.8);
      const moveX = ((letterCenterX - mousePos.x) / dist) * power * 22;
      const moveY = ((letterCenterY - mousePos.y) / dist) * power * 14;
      const rot = ((letterCenterX - mousePos.x) / dist) * power * 6;
      const sc = 1 + power * 0.05;

      dx.set(moveX);
      dy.set(moveY);
      rotate.set(rot);
      scale.set(sc);
    } else {
      // Settle smoothly to origin
      dx.set(0);
      dy.set(0);
      rotate.set(0);
      scale.set(1);
    }
  }, [mousePos, isReducedMotion, containerRef, dx, dy, rotate, scale]);

  return (
    <motion.div
      ref={letterRef}
      style={{
        x: dx,
        y: dy,
        rotate,
        scale,
      }}
      className="inline-block transition-colors duration-200 select-none cursor-default"
    >
      <span className="text-[#121316] hover:text-[#FF4D00] transition-colors duration-300">
        {char}
      </span>
    </motion.div>
  );
}

export function InteractiveTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isReducedMotion || !isVisible) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isReducedMotion, isVisible]);

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-28 lg:py-32 bg-[#F5F4F0] border-b border-[#E0DDD6] overflow-hidden select-none selection:bg-[#FF4D00]/20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Chapter Header */}
        <div className="flex items-center justify-between pb-8 border-b border-[#E0DDD6] mb-6">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#FF4D00] flex items-center gap-2">
            <span className="signal-dot" />
            TYPOGRAPHIC FIELD
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
            PHYSICAL RESPONSE SYSTEM
          </div>
        </div>

        {/* Massive Interactive Letter Field */}
        <div className="py-6 md:py-10 flex justify-between items-center w-full">
          <div className="w-full flex justify-between items-center text-6xl sm:text-8xl md:text-[10rem] lg:text-[13rem] font-bold uppercase tracking-tighter leading-none font-mono">
            {LETTERS.map((char) => (
              <TypographicLetter
                key={char}
                char={char}
                mousePos={mousePos}
                containerRef={containerRef}
                isReducedMotion={isReducedMotion}
              />
            ))}
          </div>
        </div>

        {/* Sub-label */}
        <div className="pt-6 border-t border-[#E0DDD6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
            ENGINEERED AROUND YOUR BUSINESS OPERATIONAL CONSTRAINTS
          </p>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#121316]">
            PROXIMITY-REACTIVES / RESPONSIVE ARCHITECTURE
          </div>
        </div>
      </div>
    </section>
  );
}
