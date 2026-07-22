import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Layers, AppWindow, Cpu, Workflow, ShieldCheck, ScanLine } from "lucide-react";

import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { services as staticServices } from "@/lib/constants/services";
import { ServiceService } from "@/lib/backend/services/service-service";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Services Matrix | ${siteConfig.name}`,
  description:
    "Engineering capabilities matrix — custom web applications, design systems, and digital product architecture.",
};

const serviceIcons = [AppWindow, Layers, Cpu];

export default async function ServicesPage() {
  const dynamicServices = await ServiceService.listServicesPublic();
  const displayServices =
    dynamicServices && dynamicServices.length > 0 ? dynamicServices : staticServices;

  return (
    <div className="bg-background relative min-h-screen">
      <section className="border-b border-border pt-32 pb-24">
        <SectionWrapper className="py-0">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-3xl space-y-5">
              <span className="mono-label text-[10px] text-primary">01 / Services Matrix</span>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Engineering systems at the level of infrastructure.</h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">The studio delivers modular digital infrastructure across product, operations, automation, and platform layers. Every engagement is designed as a durable system, not a single feature.</p>
            </div>
            <div className="panel-shell p-6">
              <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Delivery frame</div>
              <div className="space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Primary layers</span><span className="text-foreground">Product / Ops / AI</span></div>
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Implementation</span><span className="text-foreground">Typed, tested, documented</span></div>
                <div className="flex items-center justify-between"><span>Outcome</span><span className="text-foreground">Continuity</span></div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      <SectionWrapper className="border-b border-border bg-surface/20">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <span className="mono-label text-[10px] text-primary">02 / Capability Architecture</span>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">A layered map of what the studio can construct.</h2>
            <p className="text-sm leading-7 text-muted-foreground">Each system is formed from distinct layers: experience, product logic, orchestration, integration, and operational support.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {displayServices.map((service, sIdx) => {
              const Icon = serviceIcons[sIdx % serviceIcons.length];
              const shortDesc = (service as { shortDescription?: string }).shortDescription || (service as unknown as { short_description?: string }).short_description || "";
              const num = (sIdx + 1).toString().padStart(2, "0");

              return (
                <Link key={service.slug} href={`/services/${service.slug}`} className="panel-shell flex h-full flex-col justify-between p-6 transition-colors hover:border-border-hover">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-secondary text-primary"><Icon className="size-4" /></div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">{num}</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">{service.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{shortDesc}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                    <span>Specification</span>
                    <ArrowUpRight className="size-3.5 text-primary" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-background/70">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="panel-shell p-8">
            <div className="mb-6 text-[10px] font-mono uppercase tracking-[0.24em] text-primary">03 / Delivery model</div>
            <div className="grid gap-4 md:grid-cols-2">
              {[{ title: "Workflow design", desc: "Operational systems and process logic mapped before build.", icon: Workflow }, { title: "System integrity", desc: "Security, reliability, and future maintainability built in from the start.", icon: ShieldCheck }, { title: "Executive visibility", desc: "Dashboards and reporting designed for decision-making and oversight.", icon: ScanLine }, { title: "Platform readiness", desc: "Infrastructure that scales without forcing a rebuild.", icon: AppWindow }].map((item) => {
                const Icon = item.icon;
                return <div key={item.title} className="rounded-[var(--radius-md)] border border-border bg-surface/50 p-4"><div className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-secondary text-primary"><Icon className="size-4" /></div><h3 className="mt-3 text-sm font-semibold tracking-tight text-foreground">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p></div>;
              })}
            </div>
          </div>
          <div className="panel-shell p-8">
            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">04 / Outcome</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Product systems that remain legible as they grow.</h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">The result is not only a polished interface, but a dependable operating environment for teams, clients, and future expansion.</p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}