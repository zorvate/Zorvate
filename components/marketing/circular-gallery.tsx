"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { getPortfolioProjects, type PortfolioProject } from "@/lib/supabase/cms";

export function CircularGallery() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const supabase = createClient();
    getPortfolioProjects(supabase)
      .then((data) => {
        const published = data.filter((p) => p.status === "published" || p.featured === true);
        setProjects(published);
      })
      .catch((err) => {
        console.error("Failed to load portfolio projects for circular gallery:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Scroll progress drives base rotation angle theta
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawRotation = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const smoothRotation = useSpring(rawRotation, { stiffness: 90, damping: 20 });

  // Mouse x & y positions drive subtle secondary orbital rotation + tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseRotationRaw = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const mouseRotation = useSpring(mouseRotationRaw, { stiffness: 120, damping: 25 });

  const finalRotation = useTransform(
    [smoothRotation, mouseRotation],
    ([scrollRot, mouseRot]) => (scrollRot as number) + (mouseRot as number)
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relX);
    mouseY.set(relY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="work"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-20 md:py-28 lg:py-32 bg-[#F5F4F0] border-b border-[#E0DDD6] selection:bg-[#FF4D00]/20 overflow-hidden relative"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E0DDD6] gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#5C5D61] mb-2">
              PORTFOLIO ARCHIVE / ORBITAL
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#121316]">
              SELECTED WORK
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
              SUPABASE / ORBITAL GALLERY
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.14em] text-[#121316] hover:text-[#FF4D00] transition-colors group"
            >
              Full Archive
              <ArrowUpRight className="size-3.5 text-[#FF4D00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="h-[460px] flex items-center justify-center border border-[#E0DDD6] bg-[#EFECE5]/40 animate-pulse">
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#5C5D61]">
              LOADING SUPABASE PORTFOLIO ARCHIVE...
            </div>
          </div>
        )}

        {/* Editorial Empty State if 0 projects in Supabase */}
        {!loading && projects.length === 0 && (
          <div className="p-12 border border-[#E0DDD6] bg-[#EFECE5]/40 text-[#121316] max-w-3xl space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] text-[#FF4D00]">
              <ShieldAlert className="size-4" />
              <span>SYSTEM ARCHIVE / NDA BOUNDARY</span>
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight text-[#121316]">
              0 PUBLISHED CASE STUDIES IN ARCHIVE
            </h3>
            <p className="text-sm text-[#5C5D61] leading-relaxed">
              All active client engagements and digital engineering projects are currently governed under proprietary client boundaries. To inspect technical specifications or request confidential project walk-throughs, contact the studio engineering desk directly.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-[0.14em] font-semibold bg-[#121316] text-[#F5F4F0] hover:bg-[#FF4D00] transition-colors"
              >
                Request Technical Documentation
                <ArrowUpRight className="size-3.5 text-[#FF4D00]" />
              </Link>
            </div>
          </div>
        )}

        {/* Orbital Circular Project Gallery */}
        {!loading && projects.length > 0 && (
          <div>
            {/* Mobile Stacked List View (Viewport < 640px) */}
            <div className="block sm:hidden space-y-6">
              {projects.map((project, idx) => (
                <div key={project.id || project.slug} className="p-4 border border-[#E0DDD6] bg-[#F5F4F0] space-y-3">
                  <Link href={`/portfolio/${project.slug}`} className="block space-y-3">
                    <div className="relative aspect-[16/10] border border-[#E0DDD6] bg-[#18191D] overflow-hidden">
                      {project.image_url ? (
                        <Image src={project.image_url} alt={project.title} fill className="object-cover" sizes="100vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#8E8F94]">
                          PROJECT /{String(idx + 1).padStart(2, "0")}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#FF4D00]">
                        {project.category}
                      </div>
                      <h3 className="text-base font-bold uppercase tracking-tight text-[#121316]">
                        {project.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop Rotating Orbital Stage (Viewport >= 640px) */}
            <div className="hidden sm:flex relative min-h-[520px] md:min-h-[640px] lg:min-h-[720px] items-center justify-center py-12">
              {/* Center Focal Hub */}
              <div className="absolute z-10 text-center space-y-2 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121316] text-[#F5F4F0] text-[10px] font-mono uppercase tracking-[0.2em]">
                  <span className="signal-dot" />
                  <span>ZORVATE HUB</span>
                </div>
                <div className="text-xl font-mono uppercase font-bold tracking-[0.16em] text-[#121316]">
                  ORBITAL ARCHIVE
                </div>
              </div>

              {/* Rotating Orbital Stage */}
              <motion.div
                style={{
                  rotate: isReducedMotion ? 0 : finalRotation,
                }}
                className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] lg:w-[640px] lg:h-[640px] rounded-full border border-dashed border-[#E0DDD6] flex items-center justify-center"
              >
                {projects.map((project, idx) => {
                  const total = projects.length;
                  const angleRad = (idx / total) * 2 * Math.PI - Math.PI / 2;
                  const radius = typeof window !== "undefined" && window.innerWidth > 1024 ? 280 : typeof window !== "undefined" && window.innerWidth > 768 ? 240 : 160;
                  const posX = Math.cos(angleRad) * radius;
                  const posY = Math.sin(angleRad) * radius;

                  const isHovered = hoveredIdx === idx;
                  const isOtherHovered = hoveredIdx !== null && !isHovered;

                  return (
                    <motion.div
                      key={project.id || project.slug}
                      style={{
                        x: posX,
                        y: posY,
                      }}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={`absolute w-44 sm:w-56 md:w-64 lg:w-72 p-4 border bg-[#F5F4F0] transition-all duration-300 ${
                        isHovered
                          ? "z-30 border-[#121316] shadow-xl scale-105 bg-[#EFECE5]"
                          : isOtherHovered
                          ? "z-10 border-[#E0DDD6] opacity-50 scale-95"
                          : "z-20 border-[#E0DDD6] opacity-90"
                      }`}
                    >
                      <Link href={`/portfolio/${project.slug}`} className="block space-y-3 group">
                        {/* Image Thumbnail */}
                        <div className="relative aspect-[16/10] overflow-hidden border border-[#E0DDD6] bg-[#18191D]">
                          {project.image_url ? (
                            <Image
                              src={project.image_url}
                              alt={project.title}
                              fill
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              sizes="260px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#8E8F94] bg-[#18191D]">
                              PROJECT /{String(idx + 1).padStart(2, "0")}
                            </div>
                          )}
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#121316]/90 text-[#F5F4F0] text-[8px] font-mono uppercase tracking-[0.14em]">
                            {String(idx + 1).padStart(2, "0")}
                          </div>
                        </div>

                        {/* Content */}
                        <div>
                          <div className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#FF4D00]">
                            {project.category}
                          </div>
                          <h3 className="text-sm font-bold uppercase tracking-tight text-[#121316] group-hover:text-[#FF4D00] transition-colors truncate">
                            {project.title}
                          </h3>
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1.5">
                              {project.technologies.slice(0, 2).map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[8px] font-mono uppercase tracking-[0.08em] px-1.5 py-0.5 bg-[#E0DDD6]/60 text-[#5C5D61]"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
