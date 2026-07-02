"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string; // RGB values for opacity control
  radius?: number; // Spot radius in pixels
}

export function SpotlightGlow({
  children,
  className,
  glowColor = "rgba(109, 40, 217, 0.08)",
  radius = 600,
  ...props
}: SpotlightGlowProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn("relative overflow-hidden group/spotlight", className)}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-700 z-0"
        style={{
          background: `radial-gradient(${radius}px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 85%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
