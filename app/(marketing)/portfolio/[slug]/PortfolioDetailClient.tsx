"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Tag, Clock, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";
import { GlassCard } from "@/components/ui/glass-card";
import { ParticlesBackdrop } from "@/components/ui/particles-backdrop";

interface MetricItem {
  label: string;
  value: number;
  suffix: string;
}

interface ProcessStepItem {
  phase: string;
  title: string;
  desc: string;
}

interface PortfolioDetailClientProps {
  project: {
    slug: string;
    title: string;
    description: string;
    category: string;
    technologies?: string[] | null;
    challenge?: string | null;
    solution?: string | null;
    testimonial_quote?: string | null;
    testimonial_author?: string | null;
    testimonial_role?: string | null;
    metrics?: MetricItem[] | null;
    process_steps?: ProcessStepItem[] | null;
    client_name?: string | null;
    project_date?: string | null;
  };
}

export default function PortfolioDetailClient({ project }: PortfolioDetailClientProps) {
  // Safe parsing of jsonb lists
  const metricsList: MetricItem[] = Array.isArray(project.metrics)
    ? project.metrics
    : [
        { label: "Performance Audit", value: 99, suffix: "%" },
        { label: "Page Load Speed", value: 0.38, suffix: "s" },
      ];

  const stepsList: ProcessStepItem[] = Array.isArray(project.process_steps)
    ? project.process_steps
    : [
        { phase: "Phase 01", title: "Strategy Mapping", desc: "Setting boundaries and user journeys." },
        { phase: "Phase 02", title: "Engineering", desc: "Compiling optimized code blocks." },
      ];

  const architectureNodes = project.technologies && project.technologies.length > 0
    ? project.technologies
    : ["Next.js", "Supabase", "Tailwind CSS"];

  return (
    <div className="bg-background relative min-h-screen text-foreground">
      {/* Decorative Orbs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-[480px] h-[480px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

      {/* HERO SECTION */}
      <SpotlightGlow
        radius={700}
        glowColor="rgba(109, 40, 217, 0.08)"
        className="relative overflow-hidden border-b"
      >
        <SectionWrapper className="py-20 md:py-28 relative z-10">
          <ParticlesBackdrop quantity={60} />
          
          <div className="mx-auto max-w-4xl relative z-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all mb-8 select-none"
            >
              <ArrowLeft size={13} /> Back to Portfolio
            </Link>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 select-none flex items-center gap-1.5 w-fit">
                <Sparkles size={11} className="animate-pulse" />
                <span>{project.category}</span>
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mt-6 leading-tight select-none">
                {project.title}
              </h1>
              <p className="mt-6 text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                {project.description}
              </p>
            </div>
          </div>
        </SectionWrapper>
      </SpotlightGlow>

      {/* METRICS & SIDEBAR GRID */}
      <SectionWrapper className="py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-8 items-start">
          
          {/* Metadata parameters */}
          <div className="md:col-span-1 space-y-6">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest select-none">Project Parameters</h3>
            
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border bg-card/45 backdrop-blur-md glass-panel flex items-center gap-3">
                <Briefcase size={16} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Partner</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{project.client_name || "Enterprise Partner"}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-card/45 backdrop-blur-md glass-panel flex items-center gap-3">
                <Tag size={16} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Segment</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{project.category}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-card/45 backdrop-blur-md glass-panel flex items-center gap-3">
                <Clock size={16} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Release Date</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{project.project_date || "Continuous Delivery"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Measurable Metrics */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest select-none">Measurable Results</h3>
            
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              {metricsList.map((metric, idx) => (
                <GlassCard
                  key={idx}
                  tilt={false}
                  className="p-6 text-center flex flex-col justify-between border bg-card/30"
                >
                  <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                    <CountUp
                      end={metric.value}
                      decimals={metric.value % 1 !== 0 ? 2 : 0}
                      suffix={metric.suffix}
                      duration={2.5}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </div>
                  <div className="text-[10px] uppercase font-black tracking-wider text-muted-foreground mt-3">
                    {metric.label}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

        </div>
      </SectionWrapper>

      {/* CHALLENGE & SOLUTION BENTO */}
      <SectionWrapper className="border-t bg-muted/5 py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-5xl space-y-12">
          
          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard tiltMaxAngle={3} className="p-8 border bg-card/30">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="text-primary" size={20} />
                <h3 className="text-lg font-bold text-foreground">The Challenge</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                {project.challenge || "Detailed challenge outline under evaluation."}
              </p>
            </GlassCard>

            <GlassCard tiltMaxAngle={3} className="p-8 border bg-card/30">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <h3 className="text-lg font-bold text-foreground">The Solution</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                {project.solution || "Custom design and development framework blueprint integration."}
              </p>
            </GlassCard>
          </div>

          {/* System Architecture Blueprint */}
          <div className="pt-8 space-y-6">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest text-center select-none">System Architecture Blueprint</h3>
            
            <div className="p-8 border rounded-2xl bg-background/50 backdrop-blur-md glass-panel flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              {architectureNodes.map((node, nIdx) => (
                <div key={nIdx} className="flex items-center gap-4 select-none">
                  <div className="px-4 py-2 border rounded-xl bg-card/60 backdrop-blur text-xs font-bold text-foreground shadow-sm hover:border-primary/45 transition-colors">
                    {node}
                  </div>
                  {nIdx < architectureNodes.length - 1 && (
                    <span className="text-primary/40 font-mono text-xs hidden sm:inline">&rarr;</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </SectionWrapper>

      {/* DETAILED TIMELINE PROCESS */}
      <SectionWrapper className="border-t bg-muted/10 py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="text-center">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest select-none">Development Process</h3>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-4 text-foreground">Milestones Progression</h2>
          </div>

          <div className="relative border-l border-border/85 pl-6 sm:pl-10 space-y-12 max-w-2xl mx-auto">
            {stepsList.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Bullet indicator */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background flex items-center justify-center shadow-md shadow-primary/20" />
                
                <span className="text-[9px] uppercase font-black tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/10 select-none">
                  {step.phase}
                </span>
                
                <h4 className="text-base font-bold text-foreground mt-3 tracking-tight">{step.title}</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CLIENT TESTIMONIAL SHOWCASE */}
      {project.testimonial_quote && (
        <SectionWrapper className="border-t bg-background py-20 relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-8 select-none">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest">Client Testimonial</h3>
            
            <blockquote className="text-lg sm:text-2xl font-semibold italic leading-relaxed text-foreground max-w-2xl mx-auto">
              “{project.testimonial_quote}”
            </blockquote>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border">
                {project.testimonial_author?.charAt(0) || "Z"}
              </div>
              <div className="font-bold text-sm text-foreground mt-1">
                {project.testimonial_author || "Lead Architect"}
              </div>
              <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                {project.testimonial_role || "Partner Corp"}
              </div>
            </div>
          </div>
        </SectionWrapper>
      )}
    </div>
  );
}
