import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers, AppWindow, Cpu } from "lucide-react";

import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { services as staticServices } from "@/lib/constants/services";
import { ServiceService } from "@/lib/backend/services/service-service";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Services | ${siteConfig.name}`,
  description:
    "Explore our digital services including SaaS development, UI/UX design, and full-stack engineering.",
};

const serviceIcons = [AppWindow, Layers, Cpu];

export default async function ServicesPage() {
  const dynamicServices = await ServiceService.listServicesPublic();
  const displayServices = dynamicServices && dynamicServices.length > 0 ? dynamicServices : staticServices;

  return (
    <div className="bg-background relative min-h-screen">
      {/* Decorative Orbs */}
      <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      {/* HERO */}
      <SectionWrapper className="py-20 md:py-28 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/10 select-none">
            Capabilities Matrix
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mt-6 leading-tight">
            Our Digital Services
          </h1>
          <p className="mt-6 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            We design, assemble, and scale high-performance software modules tailored to match client product specifications.
          </p>
        </div>
      </SectionWrapper>

      {/* SERVICES LIST */}
      <SectionWrapper className="border-t bg-muted/5 py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-6xl grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service, sIdx) => {
            const Icon = serviceIcons[sIdx % serviceIcons.length];
            const shortDesc = (service as { shortDescription?: string }).shortDescription || (service as unknown as { short_description?: string }).short_description || "";
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="p-6 sm:p-8 border rounded-2xl bg-card/45 backdrop-blur-md glass-panel flex flex-col justify-between hover:border-primary/20 hover:shadow-lg transition-all duration-300 group hover:translate-y-[-4px]"
              >
                <div>
                  <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-6 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                    {shortDesc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/40 flex justify-end">
                  <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>
    </div>
  );
}