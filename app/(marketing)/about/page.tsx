import { Compass, Eye, ShieldCheck, Zap, Handshake, Sparkles } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { ParticlesBackdrop } from "@/components/ui/particles-backdrop";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";
import { GlassCard } from "@/components/ui/glass-card";
import { TeamService } from "@/lib/backend/services/team-service";
import { MOCK_TEAM } from "@/lib/supabase/cms";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `About Studio | ${siteConfig.name}`,
  description:
    "Zorvate is a premium design and frontend studio dedicated to turning ambitious concept roadmaps into responsive websites.",
};

export default async function AboutPage() {
  const dynamicTeam = await TeamService.listTeamMembersPublic();
  const team = dynamicTeam && dynamicTeam.length > 0 ? dynamicTeam : MOCK_TEAM;

  return (
    <div className="bg-background relative min-h-screen text-foreground">
      {/* HERO SECTION */}
      <SpotlightGlow
        radius={700}
        glowColor="rgba(109, 40, 217, 0.08)"
        className="relative overflow-hidden border-b"
      >
        <SectionWrapper className="py-24 md:py-32 relative z-10">
          <ParticlesBackdrop quantity={60} />
          
          {/* Floating background blobs */}
          <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-16 right-1/4 w-[480px] h-[480px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

          <div className="mx-auto max-w-4xl text-center relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 select-none shadow-sm flex items-center gap-1.5 w-fit mx-auto">
              <Sparkles size={11} className="animate-pulse" />
              <span>About Our Studio</span>
            </span>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-foreground mt-8 leading-none">
              We Craft High-End <br className="hidden sm:inline" />
              Digital Deliverables
            </h1>
            <p className="mt-6 text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Zorvate is a premium design and frontend studio dedicated to turning ambitious concept roadmaps into responsive websites, dashboard interfaces, and robust software architectures.
            </p>
          </div>
        </SectionWrapper>
      </SpotlightGlow>

      {/* MISSION & VISION */}
      <SectionWrapper className="border-t bg-muted/5 py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-8">
          <GlassCard tiltMaxAngle={3} className="p-8 border bg-card/30 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-6 shadow-sm">
                <Compass size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Our Core Mission</h2>
              <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                We empower brands and product teams to translate engineering concepts into production-grade websites. We merge aesthetic excellence with scalable, accessible code structures.
              </p>
            </div>
          </GlassCard>

          <GlassCard tiltMaxAngle={3} className="p-8 border bg-card/30 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-6 shadow-sm">
                <Eye size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Our Studio Vision</h2>
              <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                To be the premier engineering partner for ambitious companies worldwide. We strive to set new benchmarks in modern frontend performance, visual polish, and layout responsiveness.
              </p>
            </div>
          </GlassCard>
        </div>
      </SectionWrapper>

      {/* CORE VALUES */}
      <SectionWrapper className="border-t bg-muted/10 py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center select-none">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Studio Anchors</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">
              The fundamental guidelines that drive our design and programming sprints.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Uncompromising Quality",
                desc: "We write clean, semantic code built with strict type-safety and modern React architectural conventions.",
                icon: ShieldCheck,
              },
              {
                title: "High Performance",
                desc: "We target load speeds, optimize bundle sizes, and use GPU-accelerated motion layers for smooth interaction.",
                icon: Zap,
              },
              {
                title: "Collaborative Synergy",
                desc: "We integrate directly with design leads, providing transparent sprint coordination and project feedback loops.",
                icon: Handshake,
              },
            ].map((val, vIdx) => {
              const Icon = val.icon;
              return (
                <GlassCard
                  key={vIdx}
                  tilt={true}
                  tiltMaxAngle={4}
                  className="p-6 border bg-card/25 flex flex-col justify-between"
                >
                  <div>
                    <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl mb-4">
                      <Icon size={16} />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground">{val.title}</h3>
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-medium">
                      {val.desc}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* MEET OUR TEAM SECTION */}
      <SectionWrapper className="border-t bg-muted/5 py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center select-none">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Meet Our Team</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">
              The creative minds and technical builders behind our agency deliverables.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {team.map((member) => (
              <GlassCard
                key={member.id}
                tilt={true}
                tiltMaxAngle={4}
                className="p-6 border bg-card/25 flex flex-col items-center text-center group hover:border-primary/20 transition-all duration-300"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-300 shadow-md">
                  <Image
                    src={member.image_url}
                    alt={`${member.name} - ${member.role}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <h3 className="font-bold text-base text-foreground tracking-tight">{member.name}</h3>
                <p className="text-xs font-semibold text-primary mt-1">{member.role}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}