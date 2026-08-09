"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", tag: "OVERVIEW" },
  { id: "field", tag: "FIELD" },
  { id: "problem", tag: "SYSTEMS" },
  { id: "system", tag: "ARCHITECTURE" },
  { id: "capabilities", tag: "CAPABILITIES" },
  { id: "work", tag: "ARCHIVE" },
  { id: "process", tag: "METHODOLOGY" },
  { id: "principles", tag: "DISCIPLINE" },
  { id: "cta", tag: "ENGAGEMENT" },
];

export function ChapterProgress() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      const progress = Math.min(Math.max(scrollPos / (docHeight - winHeight), 0), 1);
      const currentIdx = Math.min(
        Math.floor(progress * SECTIONS.length),
        SECTIONS.length - 1
      );
      setActiveIdx(currentIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-2.5 px-3.5 py-2 bg-[#121316]/90 border border-[#28292E] text-[#F5F4F0] font-mono text-[10px] uppercase tracking-[0.2em] shadow-md select-none backdrop-blur-sm">
      <span className="signal-dot" style={{ width: 4, height: 4 }} />
      <span className="text-[#F5F4F0] font-medium">
        {SECTIONS[activeIdx]?.tag || "OVERVIEW"}
      </span>
    </div>
  );
}
