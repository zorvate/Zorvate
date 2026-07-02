"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import CountUp from "react-countup";
import Tilt from "react-parallax-tilt";
import { Sparkles, Terminal, Activity, Check } from "lucide-react";

import { createClient } from "@/lib/supabase/browser";
import { getSiteSettings } from "@/lib/supabase/cms";

import { ServicesSection } from "@/components/marketing/services-section";
import { ProcessSection } from "@/components/marketing/process-section";
import { WhyChooseUsSection } from "@/components/marketing/why-choose-us";
import { PortfolioPreviewSection } from "@/components/marketing/portfolio-preview-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { StatisticsSection } from "@/components/marketing/statistics-section";
import { CTASection } from "@/components/marketing/cta-section";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { ParticlesBackdrop } from "@/components/ui/particles-backdrop";
import { Magnetic } from "@/components/ui/magnetic";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";

const clientLogos = [
  { name: "Vercel", symbol: "▲" },
  { name: "Stripe", symbol: "⬡" },
  { name: "Linear", symbol: "⧉" },
  { name: "Raycast", symbol: "⌘" },
  { name: "Framer", symbol: "❖" },
];

const renderStatValue = (val: string | undefined) => {
  if (!val || val === "—") return "—";
  const num = parseFloat(val.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return val;
  const suffix = val.replace(/[0-9.]/g, "");
  return (
    <CountUp
      end={num}
      decimals={val.includes(".") ? 1 : 0}
      duration={2}
      suffix={suffix}
      delay={1.5}
    />
  );
};

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [logoDrawActive, setLogoDrawActive] = useState(true);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();
    async function loadSettings() {
      const s = await getSiteSettings(supabase);
      setSettings(s);
    }
    loadSettings();

    if (shouldReduceMotion) {
      setLogoDrawActive(false);
      return;
    }
    const timer = setTimeout(() => {
      setLogoDrawActive(false);
    }, 950);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  // Reduced motion overrides
  const delayBase = shouldReduceMotion ? 0 : 1.0;
  const staggerDuration = shouldReduceMotion ? 0.3 : 0.8;

  const itemVariants = (delayOffset: number) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delayBase + delayOffset,
        duration: staggerDuration,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  });

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* HERO SECTION */}
      <SpotlightGlow 
        radius={750}
        glowColor="rgba(109, 40, 217, 0.12)"
        className="relative min-h-screen flex flex-col items-center justify-center pt-24"
      >
        <SectionWrapper className="relative flex flex-col items-center text-center py-12 overflow-hidden w-full">
          {/* Particles & Lighting backdrop (Renders instantly at 0.0s) */}
          <ParticlesBackdrop quantity={120} />
          
          {/* Floating glowing light orbs */}
          <div className="absolute top-24 left-[8%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-violet-600/10 to-indigo-600/5 blur-[130px] animate-float pointer-events-none z-0" />
          <div className="absolute bottom-16 right-[8%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-600/10 to-blue-600/5 blur-[140px] animate-float-delayed pointer-events-none z-0" />

          {/* Decorative Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_80%,transparent_100%)] pointer-events-none z-10" />

          {/* CENTRAL LOGO DRAWING LAYER (0.2s - 0.8s) */}
          <AnimatePresence>
            {logoDrawActive && (
              <motion.div
                key="logo-drawing-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <div className="relative flex flex-col items-center justify-center animate-pulse">
                  <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-[0_0_20px_rgba(109,40,217,0.5)]">
                    {/* Top segment */}
                    <motion.path
                      d="M 25,25 L 75,25"
                      stroke="rgba(167, 139, 250, 0.85)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                    />
                    {/* Diagonal segment */}
                    <motion.path
                      d="M 75,25 L 25,75"
                      stroke="rgba(99, 102, 241, 0.85)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    />
                    {/* Bottom segment */}
                    <motion.path
                      d="M 25,75 L 75,75"
                      stroke="rgba(167, 139, 250, 0.85)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.2, delay: 0.7 }}
                    />
                  </svg>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.6, 0.2] }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="absolute w-36 h-36 rounded-full bg-primary/20 blur-[28px]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN HERO CONTENT STAGGERED REVEALS */}
          <div className="relative z-20 flex flex-col items-center max-w-6xl mx-auto px-4 mt-6">
            {/* Tagline Eyebrow Badge (1.0s) */}
            <motion.div
              variants={itemVariants(0.0)}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary mb-8 select-none shadow-sm"
            >
              <Sparkles size={11} className="animate-spin" />
              <span>Next-Gen Engineering Studio</span>
            </motion.div>

            {/* Headline (1.1s) */}
            <motion.h1
              variants={itemVariants(0.1)}
              initial="hidden"
              animate="visible"
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.05] text-foreground select-none"
            >
              We Engineer <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md py-2">
                Digital Landmarks
              </span>
            </motion.h1>

            {/* Description (1.2s) */}
            <motion.p
              variants={itemVariants(0.2)}
              initial="hidden"
              animate="visible"
              className="mt-8 max-w-2xl text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed font-medium"
            >
              Zorvate builds high-end SaaS applications, design systems, and portal dashboards for companies targeting outstanding visual excellence and core speed parameters.
            </motion.p>

            {/* CTA Buttons (1.3s) */}
            <motion.div
              variants={itemVariants(0.3)}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-col sm:flex-row gap-4 relative z-30"
            >
              <Magnetic>
                <Link
                  href="/auth/register"
                  className="rounded-xl bg-primary px-8 py-4 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 glow-btn hover:brightness-110 hover:shadow-primary/40 transition-all duration-300 block text-center cursor-pointer"
                >
                  Get Started
                </Link>
              </Magnetic>

              <Magnetic>
                <Link
                  href="/services"
                  className="rounded-xl border border-border/80 bg-card/40 backdrop-blur-md px-8 py-4 text-sm font-bold hover:bg-muted/80 transition-all duration-300 block text-center cursor-pointer"
                >
                  Explore Services
                </Link>
              </Magnetic>
            </motion.div>

            {/* FLOATING 3D PARALLAX DASHBOARD PREVIEW (1.4s) */}
            <motion.div
              variants={itemVariants(0.4)}
              initial="hidden"
              animate="visible"
              className="mt-16 w-full max-w-4xl px-2"
            >
              <Tilt
                tiltMaxAngleX={4}
                tiltMaxAngleY={4}
                perspective={1000}
                glareEnable={true}
                glareMaxOpacity={0.15}
                glarePosition="all"
                glareBorderRadius="16px"
                className="w-full"
              >
                <div className="relative rounded-2xl border border-white/5 bg-card/25 backdrop-blur-xl overflow-hidden glass-panel shadow-2xl p-6 flex flex-col text-left">
                  {/* Dashboard Header Bar */}
                  <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-0.5 rounded-md border border-white/5">
                      portal.zorvate.com
                    </div>
                  </div>

                  {/* Dashboard Layout Content */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar mockup */}
                    <div className="space-y-2 border-r border-white/5 pr-4 hidden md:block">
                      <div className="text-[9px] font-black text-white/40 uppercase tracking-wider mb-2">
                        Client Workspace
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/15">
                        <Activity size={12} /> Project Hub
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors">
                        <Terminal size={12} /> Sprint Timeline
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors">
                        <Check size={12} /> Team Collaboration
                      </div>
                    </div>

                    {/* Main chart panel */}
                    <div className="md:col-span-3 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-muted-foreground font-mono">PROJECT OVERVIEW</div>
                          <div className="text-lg font-extrabold text-foreground mt-0.5">Sprint Progress</div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20">
                          Sprint 04: ON TRACK
                        </div>
                      </div>

                      {/* SVG Vector Chart */}
                      <div className="h-32 w-full bg-black/20 rounded-xl border border-white/5 flex items-end p-2 relative overflow-hidden">
                        <svg className="w-full h-full text-primary" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
                              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0,25 Q15,10 30,22 T60,5 T90,28 L100,28 L100,30 L0,30 Z"
                            fill="url(#chartGlow)"
                          />
                          <motion.path
                            d="M0,25 Q15,10 30,22 T60,5 T90,28 L100,28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 1.5 }}
                          />
                        </svg>
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <Check size={8} /> Delivery Timeline
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tilt>
            </motion.div>

            {/* HERO STATISTICS METRICS BOARD (1.5s) */}
            <motion.div
              variants={itemVariants(0.5)}
              initial="hidden"
              animate="visible"
              className="mt-16 w-full max-w-4xl"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border border-white/5 bg-card/10 backdrop-blur-md rounded-2xl p-6 glass-panel select-none">
                <div className="text-center border-r border-white/5">
                  <div className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {renderStatValue(settings.projects_completed)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center border-r border-white/5">
                  <div className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {renderStatValue(settings.happy_clients)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                    Happy Clients
                  </div>
                </div>
                <div className="text-center md:border-r border-white/5">
                  <div className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {renderStatValue(settings.solutions_delivered)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                    Solutions Delivered
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {renderStatValue(settings.years_building)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                    Years Building
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Client Logos Header (2.0s onwards) */}
            <motion.div
              variants={itemVariants(0.7)}
              initial="hidden"
              animate="visible"
              className="mt-16 w-full"
            >
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-6 select-none">
                Featured Integrations & Workflows
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 hover:opacity-90 transition-opacity duration-300">
                {clientLogos.map((logo, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-2 text-sm font-bold text-foreground select-none">
                    <span className="text-primary text-base">{logo.symbol}</span>
                    <span>{logo.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </SectionWrapper>
      </SpotlightGlow>

      {/* CORE SERVICES */}
      <ServicesSection />

      {/* WHY CHOOSE US */}
      <WhyChooseUsSection />

      {/* PROCESS TIMELINE */}
      <ProcessSection />

      {/* PORTFOLIO PREVIEW */}
      <PortfolioPreviewSection />

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* STATISTICS */}
      <StatisticsSection />

      {/* CTA FOOTER CARD */}
      <CTASection />
    </div>
  );
}
