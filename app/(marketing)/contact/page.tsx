import { Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { ContactForm } from "@/components/marketing/contact-form";

export default function ContactPage() {
  return (
    <div className="bg-background relative min-h-screen text-foreground">
      <section className="border-b border-border pt-32 pb-24">
        <SectionWrapper className="py-0">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl space-y-5">
              <span className="mono-label text-[10px] text-primary">01 / Project Initialization</span>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Start a project with a clear technical brief.</h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">Share the scope, constraints, and operating context. We will respond with a structured path for the system, the workflow, and the delivery plan.</p>
            </div>
            <div className="panel-shell p-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Response model</div>
              <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Response</span><span className="text-foreground">Within 24 hours</span></div>
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Format</span><span className="text-foreground">Scope + timeline</span></div>
                <div className="flex items-center justify-between"><span>Channel</span><span className="text-foreground">Direct engineering desk</span></div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      <SectionWrapper className="border-b border-border bg-surface/20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <span className="mono-label text-[10px] text-primary">02 / Studio desk</span>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Direct lines for onboarding, audits, and sprint allocation.</h2>
            <div className="space-y-3">
              {[{icon: Mail, label: "Direct email", value: "hello@zorvate.com"}, {icon: MapPin, label: "Operations", value: "Remote worldwide"}, {icon: Clock, label: "Response window", value: "Mon – Fri, active response"}].map((item) => {
                const Icon = item.icon;
                return <div key={item.label} className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border bg-surface/50 p-4"><div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-secondary text-primary"><Icon className="size-4" /></div><div><div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">{item.label}</div><div className="mt-1 text-sm font-semibold text-foreground">{item.value}</div></div></div>;
              })}
            </div>
            <Link href="/services" className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.24em] text-primary transition-colors hover:text-foreground">
              Review services <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
