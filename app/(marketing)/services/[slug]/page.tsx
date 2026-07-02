import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { services as staticServices } from "@/lib/constants/services";
import { ServiceService } from "@/lib/backend/services/service-service";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { Service } from "@/lib/supabase/cms";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const dynamicServices = await ServiceService.listServicesPublic();
  const dynamicSlugs = dynamicServices.map((s) => ({ slug: s.slug }));
  const staticSlugs = staticServices.map((s) => ({ slug: s.slug }));
  
  const allSlugs = [...dynamicSlugs, ...staticSlugs];
  const uniqueSlugs = allSlugs.filter(
    (value, index, self) => self.findIndex((t) => t.slug === value.slug) === index
  );
  return uniqueSlugs;
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;

  let service = (await ServiceService.getServiceBySlugPublic(slug)) as Service | null;
  if (!service) {
    service = (staticServices.find((item) => item.slug === slug) as Service | undefined) || null;
  }

  if (!service) {
    notFound();
  }



  return (
    <div className="bg-background relative min-h-screen">
      {/* Decorative background gradients */}
      <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      {/* HERO SECTION */}
      <SectionWrapper className="py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all mb-8"
          >
            <ArrowLeft size={13} /> Back to Services
          </Link>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/10 select-none">
              Capabilities Specifications
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mt-4 leading-tight">
              {service.title}
            </h1>
            <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
              {service.description}
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* WHAT'S INCLUDED SECTION */}
      <SectionWrapper className="border-t bg-muted/5 py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground select-none">
            What&apos;s Included in this Scope
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {service.features.map((feature: string) => (
              <div
                key={feature}
                className="p-5 border rounded-2xl bg-card/45 backdrop-blur-md glass-panel flex items-start gap-3 hover:border-primary/15 transition-all"
              >
                <div className="text-emerald-500 flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-foreground leading-normal">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
