"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { getPortfolioProjects, type PortfolioProject } from "@/lib/supabase/cms";

export function SelectedWorkEditorial() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    getPortfolioProjects(supabase)
      .then((data) => {
        const published = data.filter((p) => p.status === "published" || p.featured === true);
        setProjects(published);
      })
      .catch((err) => {
        console.error("Failed to load portfolio projects from Supabase:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="work"
      className="py-24 md:py-36 bg-[#F5F4F0] border-b border-[#E0DDD6] selection:bg-[#FF4D00]/20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-[#E0DDD6] gap-4 mb-16">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#5C5D61] mb-2">
              FEATURED / CASE STUDIES
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#121316]">
              SELECTED WORK
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#5C5D61]">
              SUPABASE / SYSTEM ARCHIVE
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

        {/* Loading shimmer */}
        {loading && (
          <div className="space-y-28">
            {[0, 1].map((i) => (
              <div key={i} className="grid gap-12 lg:grid-cols-12 lg:items-center animate-pulse">
                <div className="lg:col-span-7 aspect-[16/10] bg-[#E6E2D8]" />
                <div className="lg:col-span-5 space-y-4">
                  <div className="h-3 bg-[#E6E2D8] w-1/3 rounded" />
                  <div className="h-8 bg-[#E6E2D8] w-3/4 rounded" />
                  <div className="h-4 bg-[#E6E2D8] w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Intentional Editorial Empty State if 0 projects returned from Supabase */}
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

        {/* Real Project Compositions */}
        {!loading && projects.length > 0 && (
          <div className="space-y-28">
            {projects.map((project, idx) => {
              const isEven = idx % 2 === 0;
              const projectCode = `PROJECT / ${String(idx + 1).padStart(3, "0")}`;

              return (
                <motion.div
                  key={project.id || project.slug}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="grid gap-12 lg:grid-cols-12 lg:items-center"
                >
                  {/* Image Container */}
                  <div
                    className={`lg:col-span-7 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0.96 }}
                      whileInView={{ scale: 1.0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      className="relative aspect-[16/10] overflow-hidden border border-[#E0DDD6] bg-[#18191D] group"
                    >
                      {project.image_url ? (
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 100vw, 55vw"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col justify-between p-8 bg-[#18191D] text-[#8E8F94] font-mono">
                          <div className="text-xs tracking-[0.2em] text-[#FF4D00]">
                            {projectCode}
                          </div>
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-[#F5F4F0] uppercase">
                              {project.title}
                            </div>
                            <div className="text-xs text-[#5C5D61]">
                              {project.category}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Code badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-[#121316]/90 text-[#F5F4F0] text-[9px] font-mono uppercase tracking-[0.16em]">
                        <span className="signal-dot" style={{ width: 4, height: 4 }} />
                        {projectCode}
                      </div>

                      {/* Category badge */}
                      {project.category && (
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-[#121316]/90 text-[#8E8F94] text-[9px] font-mono uppercase tracking-[0.14em]">
                          {project.category}
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Case Study Meta */}
                  <div
                    className={`lg:col-span-5 space-y-5 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#FF4D00] flex items-center gap-2">
                      <span className="signal-dot" />
                      <span>{project.category}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#121316] leading-tight">
                      {project.title}
                    </h3>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#5C5D61] pb-3 border-b border-[#E0DDD6]">
                        {project.technologies.slice(0, 4).join(" / ")}
                      </div>
                    )}

                    <p className="text-sm text-[#5C5D61] leading-relaxed">
                      {project.description}
                    </p>

                    {/* Metrics if available in DB */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="flex gap-8 pt-2">
                        {project.metrics.slice(0, 2).map((m) => (
                          <div key={m.label} className="space-y-0.5">
                            <div className="text-xl font-bold text-[#121316] font-mono">
                              {m.value}{m.suffix}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#5C5D61]">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] font-semibold text-[#121316] hover:text-[#FF4D00] transition-colors group"
                      >
                        <span>VIEW CASE</span>
                        <ArrowUpRight className="size-4 text-[#FF4D00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
