"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";

export function HeroSignature() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 01 -> 05 Hero Scroll Sequence Transforms
  // Instead of scaling the image itself with scaleX (which distorts pixels),
  // we animate the clipPath of the outer frame. The underlying image surface stays 100% full-width
  // and object-cover, producing an authentic camera un-cropping / viewport expansion!

  // Clip inset percentages: start with portrait crop (e.g. 24% left & 24% right inset), end at 0% full width
  const clipInset = useTransform(scrollYProgress, [0.05, 0.6], [24, 0]);
  const clipPathStyle = useTransform(clipInset, (val) => `inset(0% ${val}% 0% ${val}% round 4px)`);

  // Subtle zoom/pan on the underlying image during reveal
  const imageScale = useTransform(scrollYProgress, [0.05, 0.65], [1.08, 1.0]);

  // Typography transitions
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.25]);
  const headlineY = useTransform(scrollYProgress, [0, 0.45], [0, -20]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[170vh] bg-[#F5F4F0] border-b border-[#E0DDD6] select-none grid-line-pattern"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen flex flex-col justify-end overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 pt-16 lg:pt-20 pb-6 flex flex-col gap-4 md:gap-6">

          {/* Top Technical Metadata Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-[#E0DDD6]">
            <div className="inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.2em] text-[#121316]">
              <span className="signal-dot" />
              <span>DIGITAL ENGINEERING STUDIO / 001</span>
              <span className="text-[#84858A] hidden sm:inline">|</span>
              <span className="text-[#FF4D00] text-[10px] hidden sm:inline">[SYS_OK: 99.98%]</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
              <span className="hidden md:inline text-[#84858A]">31.5204° N, 74.3587° E</span>
              <span>Pakistan / Worldwide</span>
            </div>
          </div>

          {/* Headline & Body Row */}
          <motion.div
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="py-4 md:py-6 grid gap-6 lg:grid-cols-12 lg:items-end"
          >
            <div className="lg:col-span-7">
              <h1 className="text-5xl sm:text-7xl lg:text-[5.8rem] font-bold tracking-tight text-[#121316] uppercase leading-[0.92]">
                BUILD
                <br />
                DIGITAL
                <br />
                SYSTEMS.
              </h1>
            </div>

            <div className="lg:col-span-5 space-y-5 lg:pl-6 pb-1">
              <p className="text-base text-[#5C5D61] leading-relaxed font-normal max-w-md">
                We build websites, software, AI and automation around the way your business actually works.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#systems"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-[0.14em] font-semibold bg-[#121316] text-[#F5F4F0] hover:bg-[#FF4D00] transition-colors duration-200 group"
                >
                  Explore Systems
                  <ArrowUpRight className="size-3.5 text-[#FF4D00] group-hover:text-[#F5F4F0] transition-colors" />
                </a>

                <a
                  href="#work"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-[0.14em] font-medium border border-[#E0DDD6] text-[#5C5D61] hover:border-[#121316] hover:text-[#121316] transition-colors duration-200"
                >
                  View Work
                  <ArrowDown className="size-3 text-[#5C5D61]" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* SIGNATURE PORTRAIT → LANDSCAPE CROP REVEAL */}
          {/* Architecture: Outer Animated Viewport Clip -> Inner Fixed Full-Width Image Surface */}
          <div className="w-full flex justify-center pb-2">
            <motion.div
              style={{
                clipPath: clipPathStyle,
                willChange: "clip-path",
              }}
              className="relative w-full overflow-hidden bg-[#18191D] border border-[#121316]/15 shadow-sm"
            >
              {/* Inner Full-Width Surface (Image keeps 100% intrinsic aspect cover geometry) */}
              <motion.div
                style={{
                  scale: imageScale,
                  willChange: "transform",
                }}
                className="relative w-full h-[260px] sm:h-[340px] md:h-[400px]"
              >
                <Image
                  src="/images/hero-editorial.png"
                  alt="Zorvate — Digital Engineering System Architecture"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                />
              </motion.div>

              {/* Meta Badges */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2 px-3 py-1.5 bg-[#121316]/90 text-[#F5F4F0] text-[9px] font-mono uppercase tracking-[0.18em]">
                <span className="signal-dot" style={{ width: 4, height: 4 }} />
                <span>SYSTEM ARCHITECTURE / v4.2</span>
              </div>

              <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 hidden sm:flex items-center gap-4 px-3 py-1.5 bg-[#121316]/90 text-[#F5F4F0] text-[9px] font-mono tracking-[0.14em]">
                <span>PORTRAIT → LANDSCAPE</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
