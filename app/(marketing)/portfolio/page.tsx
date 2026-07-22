import { Metadata } from "next";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { PortfolioGrid } from "@/components/marketing/portfolio-grid";
import { PortfolioService } from "@/lib/backend/services/portfolio-service";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Portfolio Archive | ${siteConfig.name}`,
  description:
    "Explore case studies, system architecture, and digital deliverables engineered by Zorvate.",
};

export default async function PortfolioPage() {
  const projects = await PortfolioService.listPublishedProjectsOnly();

  return (
    <div className="bg-background relative min-h-screen">
      <section className="border-b border-border pt-32 pb-24">
        <SectionWrapper className="py-0">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl space-y-5">
              <span className="mono-label text-[10px] text-primary">01 / Portfolio Archive</span>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Infrastructure work documented as case studies.</h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">The archive collects product systems, execution environments, and operating surfaces that were built to perform under real constraints.</p>
            </div>
            <div className="panel-shell p-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Archive notes</div>
              <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Scope</span><span className="text-foreground">Applications & portals</span></div>
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Delivery</span><span className="text-foreground">System-level</span></div>
                <div className="flex items-center justify-between"><span>Readout</span><span className="text-foreground">Case study</span></div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      <SectionWrapper className="border-b border-border bg-surface/20">
        <PortfolioGrid initialProjects={projects} />
      </SectionWrapper>
    </div>
  );
}