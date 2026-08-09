import { Metadata } from "next";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { PortfolioGrid } from "@/components/marketing/portfolio-grid";
import { PortfolioService } from "@/lib/backend/services/portfolio-service";
import { siteConfig } from "@/config/site";
import { ParticlesBackdrop } from "@/components/ui/particles-backdrop";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";

export const metadata: Metadata = {
  title: `Portfolio | ${siteConfig.name}`,
  description: "Explore digital landmarks, custom SaaS platforms, and user interfaces engineered by Zorvate.",
};

export default async function PortfolioPage() {
  const projects = await PortfolioService.listPublishedProjectsOnly();

  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-24 left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-violet-600/10 to-indigo-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-32 right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-cyan-600/10 to-blue-600/5 blur-[130px] pointer-events-none z-0" />

      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* HERO SECTION */}
      <SpotlightGlow
        radius={700}
        glowColor="rgba(147, 51, 234, 0.08)"
        className="relative overflow-hidden z-10"
      >
        <SectionWrapper className="py-28 md:py-36 relative">
          <ParticlesBackdrop quantity={70} />
          
          <div className="text-center max-w-4xl mx-auto relative z-10 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 select-none shadow-lg shadow-primary/5">
              Case Study Archives
            </span>
            <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-foreground leading-[0.95] select-none">
              Selected <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                Deliverables
              </span>
            </h1>
            <p className="mt-8 text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              We design and engineer bespoke software platforms, high-performance dashboards, and responsive frontends. Review our dynamic case studies below.
            </p>
          </div>
        </SectionWrapper>
      </SpotlightGlow>

      {/* GRID */}
      <SectionWrapper className="border-t border-white/5 bg-muted/5 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <PortfolioGrid initialProjects={projects} />
        </div>
      </SectionWrapper>
    </div>
  );
}