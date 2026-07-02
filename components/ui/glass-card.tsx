"use client";

import React from "react";
import Tilt from "react-parallax-tilt";
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
  tilt = true,
  elevation = "low",
  glowColor = "none",
  tiltMaxAngle = 7,
  ...props
}: GlassCardProps) {
  const panelClass = cn(
    elevation === "high" ? "glass-panel-elevated" : "glass-panel",
    glowColor === "primary" && "hover:shadow-primary-glow",
    glowColor === "accent" && "hover:shadow-accent-glow",
    "relative overflow-hidden group rounded-2xl transition-all duration-300",
    className
  );

  if (!tilt) {
    return (
      <div className={panelClass} {...props}>
        {children}
      </div>
    );
  }

  return (
    <Tilt
      tiltMaxAngleX={tiltMaxAngle}
      tiltMaxAngleY={tiltMaxAngle}
      perspective={1000}
      glareEnable={true}
      glareMaxOpacity={0.12}
      glareColor="#a855f7"
      glarePosition="all"
      glareBorderRadius="20px"
      transitionSpeed={1200}
      className={panelClass}
    >
      <div {...props}>
        {children}
      </div>
    </Tilt>
  );
}
