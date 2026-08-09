"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Tag, Clock, Sparkles, CheckCircle2, ShieldAlert, ExternalLink, ArrowRight } from "lucide-react";
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
    image_url?: string | null;
    video_url?: string | null;
    live_url?: string | null;
    content?: string | null;
    gallery_urls?: string[] | null;
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

// Custom Markdown parser helper
function renderMarkdown(content: string | null) {
  if (!content) return null;

  const lines = content.split(/\r?\n/);
  return (
    <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="text-lg font-bold text-foreground mt-6 mb-2">
              {trimmed.substring(4)}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="text-xl font-bold text-foreground mt-8 mb-3 border-b border-white/5 pb-2">
              {trimmed.substring(3)}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={idx} className="text-2xl font-black text-foreground mt-10 mb-4">
              {trimmed.substring(2)}
            </h2>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <li key={idx} className="ml-6 list-disc text-muted-foreground my-1">
              {trimmed.substring(2)}
            </li>
          );
        }
        if (trimmed === "") {
          return <div key={idx} className="h-2" />;
        }
        return (
          <p key={idx} className="text-muted-foreground">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function PortfolioDetailClient({ project }: PortfolioDetailClientProps) {
  const metricsList: MetricItem[] = Array.isArray(project.metrics) ? project.metrics : [];
  const stepsList: ProcessStepItem[] = Array.isArray(project.process_steps) ? project.process_steps : [];
  const architectureNodes = project.technologies && project.technologies.length > 0
    ? project.technologies
    : ["Next.js", "Supabase", "Tailwind CSS"];

  return (
    <div className="bg-background relative min-h-screen text-foreground overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-[480px] h-[480px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />
      
      {/* Immersive background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* HERO SECTION */}
      <SpotlightGlow
        radius={700}
        glowColor="rgba(109, 40, 217, 0.08)"
        className="relative overflow-hidden border-b border-white/5 z-10"
      >
        <SectionWrapper className="py-24 md:py-32 relative z-10">
          <ParticlesBackdrop quantity={60} />
          
          <div className="mx-auto max-w-4xl relative z-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all mb-8 select-none bg-muted/20 hover:bg-muted/40 px-3.5 py-2 rounded-xl border border-white/5"
            >
              <ArrowLeft size={13} /> Back to Portfolio
            </Link>

            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20 select-none flex items-center gap-1.5 w-fit">
                <Sparkles size={11} className="animate-pulse" />
                <span>{project.category}</span>
              </span>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-foreground leading-[1.05] select-none">
                {project.title}
              </h1>
              <p className="mt-6 text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed font-medium max-w-2xl">
                {project.description}
              </p>
              
              {project.live_url && (
                <div className="pt-2">
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25 px-5 py-3 rounded-xl transition-all"
                  >
                    Visit Live Site <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>
      </SpotlightGlow>

      {/* METRICS & PARAMETERS */}
      <SectionWrapper className="py-16 md:py-24 relative z-10 border-b border-white/5 bg-card/5">
        <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-8 items-start">
          
          {/* Metadata parameters */}
          <div className="md:col-span-1 space-y-6">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest select-none">Project Parameters</h3>
            
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl border border-white/5 bg-card/25 backdrop-blur-md flex items-center gap-3">
                <Briefcase size={16} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Partner</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{project.client_name || "Enterprise Partner"}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-card/25 backdrop-blur-md flex items-center gap-3">
                <Tag size={16} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Segment</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{project.category}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-card/25 backdrop-blur-md flex items-center gap-3">
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
            
            {metricsList.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                {metricsList.map((metric, idx) => (
                  <GlassCard
                    key={idx}
                    tilt={false}
                    className="p-6 text-center flex flex-col justify-center border border-white/5 bg-card/20 shadow-xl"
                  >
                    <div className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
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
            ) : (
              <div className="p-8 border border-dashed rounded-xl text-center text-xs text-muted-foreground bg-muted/5 font-semibold italic pt-12">
                Showcasing operational metrics under compliance auditing.
              </div>
            )}
          </div>

        </div>
      </SectionWrapper>

      {/* CHALLENGE & SOLUTION BENTO */}
      <SectionWrapper className="bg-muted/5 py-20 relative z-10">
        <div className="mx-auto max-w-5xl space-y-12">
          
          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard tiltMaxAngle={3} className="p-8 border border-white/5 bg-card/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="text-primary" size={20} />
                <h3 className="text-lg font-bold text-foreground">The Challenge</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                {project.challenge || "Detailed challenge outline under evaluation."}
              </p>
            </GlassCard>

            <GlassCard tiltMaxAngle={3} className="p-8 border border-white/5 bg-card/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
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
            
            <div className="p-8 border border-white/5 rounded-2xl bg-card/5 backdrop-blur-md flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              {architectureNodes.map((node, nIdx) => (
                <div key={nIdx} className="flex items-center gap-4 select-none">
                  <div className="px-4 py-2 border border-white/5 hover:border-primary/45 rounded-xl bg-background/50 text-xs font-bold text-foreground shadow-sm transition-all">
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

      {/* RICH TEXT CASE STUDY CONTENT */}
      {project.content && (
        <SectionWrapper className="border-t border-white/5 bg-background py-20 relative z-10">
          <div className="mx-auto max-w-3xl p-8 sm:p-12 border border-white/5 rounded-2xl bg-card/10 backdrop-blur-md shadow-2xl">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-6 select-none">Project Breakdown</h3>
            {renderMarkdown(project.content)}
          </div>
        </SectionWrapper>
      )}

      {/* GALLERY SCREENSHOTS SHOWCASE */}
      {project.gallery_urls && project.gallery_urls.length > 0 && (
        <SectionWrapper className="border-t border-white/5 bg-card/5 py-20 relative z-10">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="text-center">
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest select-none">Interface Gallery</h3>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 text-foreground">Interactive Showcase</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 pt-6">
              {project.gallery_urls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-muted shadow-2xl hover:border-primary/20 transition-all duration-500 group">
                  <img src={url} alt={`Gallery Screen ${idx + 1}`} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* DETAILED TIMELINE PROCESS */}
      {stepsList.length > 0 && (
        <SectionWrapper className="border-t border-white/5 bg-card/10 py-20 relative z-10">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="text-center">
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest select-none">Development Process</h3>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 text-foreground">Milestones Progression</h2>
            </div>

            <div className="relative border-l border-border/80 pl-6 sm:pl-10 space-y-12 max-w-2xl mx-auto">
              {stepsList.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Bullet indicator */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background flex items-center justify-center shadow-lg shadow-primary/20" />
                  
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
      )}

      {/* CLIENT TESTIMONIAL SHOWCASE */}
      {project.testimonial_quote && (
        <SectionWrapper className="border-t bg-background py-24 relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-8 select-none">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest">Client Testimonial</h3>
            
            <blockquote className="text-xl sm:text-3xl font-semibold italic leading-relaxed text-foreground max-w-2xl mx-auto">
              “{project.testimonial_quote}”
            </blockquote>
            
            <div className="flex flex-col items-center gap-3 pt-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center border border-primary/20 shadow-lg">
                {project.testimonial_author?.charAt(0) || "Z"}
              </div>
              <div>
                <div className="font-bold text-base text-foreground">
                  {project.testimonial_author || "Lead Architect"}
                </div>
                <div className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mt-0.5">
                  {project.testimonial_role || "Partner Corp"}
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* CONVERSION BOTTOM SECTION */}
      <SectionWrapper className="border-t border-white/5 bg-card/10 py-20 text-center relative z-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-none">
            Interested in Similar Results?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Let&apos;s discuss how we can engineer custom dashboards, SaaS layouts, and core systems for your team.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25 px-8 py-4 rounded-xl transition-all"
            >
              Initiate Project Consultation <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
