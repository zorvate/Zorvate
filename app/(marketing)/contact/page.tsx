"use client";

import { Sparkles, Mail, MapPin, Calendar } from "lucide-react";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { ContactForm } from "@/components/marketing/contact-form";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";
import { GlassCard } from "@/components/ui/glass-card";
import { ParticlesBackdrop } from "@/components/ui/particles-backdrop";

export default function ContactPage() {
  return (
    <div className="bg-background relative min-h-screen text-foreground">
      {/* HERO */}
      <SpotlightGlow
        radius={600}
        glowColor="rgba(109, 40, 217, 0.08)"
        className="relative overflow-hidden border-b"
      >
        <SectionWrapper className="py-24 md:py-32 relative z-10">
          <ParticlesBackdrop quantity={60} />
          
          {/* Floating background glows */}
          <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-16 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

          <div className="mx-auto max-w-3xl text-center relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 select-none shadow-sm flex items-center gap-1.5 w-fit mx-auto">
              <Sparkles size={11} className="animate-pulse" />
              <span>Get in touch</span>
            </span>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-foreground mt-8 leading-none">
              Let&apos;s Build Something Great
            </h1>
            <p className="mt-6 text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
              Tell us about your project scale and goals—we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </SectionWrapper>
      </SpotlightGlow>

      {/* INQUIRY DESK GRID */}
      <SectionWrapper className="border-t bg-muted/5 py-16 md:py-24 relative z-10">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-5 items-start">
          
          {/* Contact Info Column (2/5 size) */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground select-none">
                Inquiry Desk
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed font-medium">
                Connect with our core team. We usually respond to new project specifications within 24 hours.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <GlassCard tilt={false} className="p-5 border bg-card/25 flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">General Email</p>
                  <p className="font-bold text-xs text-foreground mt-1 select-all">hello@zorvate.com</p>
                </div>
              </GlassCard>

              <GlassCard tilt={false} className="p-5 border bg-card/25 flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Geographic Coordinates</p>
                  <p className="font-bold text-xs text-foreground mt-1">Remote Worldwide</p>
                </div>
              </GlassCard>

              <GlassCard tilt={false} className="p-5 border bg-card/25 flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Studio Sprints</p>
                  <p className="font-bold text-xs text-foreground mt-1">Monday – Friday</p>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Contact Form Column (3/5 size) */}
          <div className="md:col-span-3">
            <ContactForm />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
