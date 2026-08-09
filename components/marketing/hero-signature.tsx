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

  // Image motion: starts at bottom of hero, travels upward/across as user scrolls
  // translateY moves the image upward through the composition
  const imageY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);

  // Aspect ratio transition: 16:9 landscape → 9:16 portrait
  // We animate the container's padding-bottom (aspect ratio proxy) via clip-path
  // The image stays object-cover, the container shape changes
  const frameWidth = useTransform(scrollYProgress, [0.15, 0.65], [100, 45]);
  const frameHeight = useTransform(scrollYProgress, [0.15, 0.65], [56, 100]);

  // Text displacement: as image rises into text zone, text shifts left
  const textX = useTransform(scrollYProgress, [0.2, 0.55], [0, -40]);
  const textOpacity = useTransform(scrollYProgress, [0.35, 0.6], [1, 0.15]);

  // Subtle image zoom settling
  const imageScale = useTransform(scrollYProgress, [0, 0.65], [1.06, 1.0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[180vh] bg-[#F5F4F0] border-b border-[#E0DDD6] select-none"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 pt-20 lg:pt-24 pb-6 flex-1 flex flex-col">

          {/* Top Technical Metadata Row — simplified */}
          <div className="flex items-center justify-between py-3 border-b border-[#E0DDD6] shrink-0">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#121316]">
              ZORVATE — DIGITAL ENGINEERING STUDIO
            </div>
            <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61] hidden sm:block">
              Pakistan / Worldwide
            </div>
          </div>

          {/* Main composition area: Text + Image negotiate space */}
          <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 pt-8 md:pt-12 relative">

            {/* LEFT: Typography block — physically displaces when image enters */}
            <motion.div
              style={{ x: textX, opacity: textOpacity }}
              className="lg:w-[55%] shrink-0 flex flex-col justify-center space-y-6"
            >
              <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-tight text-[#121316] uppercase leading-[0.92]">
                BUILD
                <br />
                DIGITAL
                <br />
                SYSTEMS.
              </h1>

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
            </motion.div>

            {/* RIGHT: Image — physical media object that moves through the layout */}
            <motion.div
              style={{
                y: imageY,
                width: useTransform(frameWidth, (v) => `${v}%`),
              }}
              className="relative lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 overflow-hidden bg-[#18191D]"
            >
              <motion.div
                style={{
                  paddingBottom: useTransform(frameHeight, (v) => `${v}%`),
                }}
                className="relative w-full"
              >
                <motion.div
                  style={{
                    scale: imageScale,
                    willChange: "transform",
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/hero-editorial.png"
                    alt="Zorvate — Digital Engineering System Architecture"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
