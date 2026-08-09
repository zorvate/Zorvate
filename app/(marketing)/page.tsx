"use client";

import { HeroSignature } from "@/components/marketing/hero-signature";
import { InteractiveTypography } from "@/components/marketing/interactive-typography";
import { ProblemSection } from "@/components/marketing/problem-section";
import { ZorvateSystemSection } from "@/components/marketing/zorvate-system";
import { WhatWeEngineer } from "@/components/marketing/what-we-engineer";
import { CircularGallery } from "@/components/marketing/circular-gallery";
import { ProcessEditorial } from "@/components/marketing/process-editorial";
import { EngineeringPrinciplesEditorial } from "@/components/marketing/engineering-principles-editorial";
import { FinalCTAEditorial } from "@/components/marketing/final-cta-editorial";
import { ChapterProgress } from "@/components/marketing/chapter-progress";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#121316] selection:bg-[#FF4D00]/20">
      {/* Minimal Chapter Progress Indicator */}
      <ChapterProgress />

      {/* 01 — HERO: Portrait → Landscape Scroll Sequence */}
      <HeroSignature />

      {/* 02 — INTERACTIVE TYPOGRAPHY: Cursor-reactive ZORVATE field */}
      <InteractiveTypography />

      {/* 03 — THE PROBLEM: Manual vs Connected System */}
      <ProblemSection />

      {/* 04 — ZORVATE SYSTEM: Website → Data → Automation → AI → Operations */}
      <ZorvateSystemSection />

      {/* 05 — WHAT WE ENGINEER: 4 core system types */}
      <WhatWeEngineer />

      {/* 06 — SELECTED WORK: Circular Supabase orbital gallery */}
      <CircularGallery />

      {/* 07 — ENGINEERING PROCESS: Discover → Architect → Build → Connect → Automate → Deploy */}
      <ProcessEditorial />

      {/* 08 — ENGINEERING PRINCIPLES: Precision · Systems · Clarity · Security */}
      <EngineeringPrinciplesEditorial />

      {/* 09 — CTA: YOUR BUSINESS HAS A SYSTEM WAITING TO BE BUILT. */}
      <FinalCTAEditorial />

      {/* 10 — FOOTER (rendered by marketing layout) */}
    </div>
  );
}
