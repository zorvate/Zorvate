"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tilt?: boolean;
  elevation?: "low" | "high";
  glowColor?: "primary" | "accent" | "none";
  tiltMaxAngle?: number;
}

export function GlassCard({
  children,
  className,
  tilt = false,
  elevation = "low",
  glowColor = "none",
  tiltMaxAngle = 0,
  ...props
}: GlassCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const tiltTransform =
    tilt && isHovered && dimensions.width && dimensions.height
      ? `perspective(600px) rotateX(${((coords.y / dimensions.height - 0.5) * tiltMaxAngle).toFixed(2)}deg) rotateY(${((coords.x / dimensions.width - 0.5) * tiltMaxAngle).toFixed(2)}deg)`
      : undefined;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)] border border-border transition-all duration-300 group",
        elevation === "high" ? "bg-surface-secondary" : "bg-surface",
        "hover:border-border-hover",
        glowColor === "primary" && "hover:border-primary/40",
        glowColor === "accent" && "hover:border-accent/40",
        className
      )}
      {...props}
      style={{
        transform: tiltTransform,
      }}
    >
      {/* Subtle Mouse Spotlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[var(--radius-card)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, rgba(139, 92, 246, 0.05), transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Export alias for engineered clarity
export const EngineeredCard = GlassCard;
