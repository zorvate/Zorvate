import { Metadata } from "next";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { PortfolioGrid } from "@/components/marketing/portfolio-grid";
import { PortfolioService } from "@/lib/backend/services/portfolio-service";
import { siteConfig } from "@/config/site";
import { ParticlesBackdrop } from "@/components/ui/particles-backdrop";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";

export const metadata: Metadata = {
  title: `Portfolio | ${siteConfig.name}`,
  description: "Explore recent projects built by Zorvate.",
};

export default async function PortfolioPage() {
  const projects = await PortfolioService.listPublishedProjectsOnly();

  return (
    <div className="bg-background relative min-h-screen">
      {/* HERO */}
      <SpotlightGlow
        radius={600}
        glowColor="rgba(168, 85, 247, 0.08)"
        className="relative overflow-hidden"
      >
        <SectionWrapper className="py-24 md:py-32 relative z-10">
          <ParticlesBackdrop quantity={60} />
          
          {/* Floating backdrop glow */}
          <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-16 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

          <div className="text-center max-w-4xl mx-auto relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 select-none shadow-sm">
              Project Archives
            </span>
            <h1 className="mt-8 text-5xl sm:text-7xl font-black tracking-tight text-foreground leading-none">
              Our Portfolio
            </h1>
            <p className="mt-6 text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
              Review digital deliverables, landing page frameworks, and admin database portals configured for partners globally.
            </p>
          </div>
        </SectionWrapper>
      </SpotlightGlow>

      {/* GRID */}
      <SectionWrapper className="border-t bg-muted/5 py-16 md:py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <PortfolioGrid initialProjects={projects} />
        </div>
      </SectionWrapper>
    </div>
  );
}