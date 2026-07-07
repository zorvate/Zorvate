"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string; // RGB values for opacity control
  radius?: number; // Spot radius in pixels
}

export function SpotlightGlow({
  children,
  className,
  glowColor = "var(--color-amethyst-soft)",
  radius = 600,
  ...props
}: SpotlightGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (!rectRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
    const x = e.clientX - rectRef.current.left;
    const y = e.clientY - rectRef.current.top;
    containerRef.current.style.setProperty("--mouse-x", `${x}px`);
    containerRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      className={cn("relative overflow-hidden group/spotlight", className)}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-700 z-0"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), ${glowColor}, transparent 85%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
