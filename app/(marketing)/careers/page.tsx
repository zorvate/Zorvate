"use client";

import { useState } from "react";
import { Briefcase, MapPin, Clock, Sparkles } from "lucide-react";

import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";
import { GlassCard } from "@/components/ui/glass-card";
import { ParticlesBackdrop } from "@/components/ui/particles-backdrop";

const initialJobs = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$120k - $150k",
  },
  {
    title: "UI/UX Product Designer",
    department: "Design",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$90k - $110k",
  },
  {
    title: "Project Operations Manager",
    department: "Management",
    location: "Remote",
    type: "Part-time",
    salary: "$40/hr - $60/hr",
  },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [cover, setCover] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !resumeUrl) {
      alert("Please fill in name, email and resume link.");
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* HERO */}
      <SpotlightGlow
        radius={600}
        glowColor="rgba(109, 40, 217, 0.08)"
        className="relative overflow-hidden border-b"
      >
        <SectionWrapper className="py-24 md:py-32 relative z-10">
          <ParticlesBackdrop quantity={60} />
          
          <div className="mx-auto max-w-3xl text-center relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 select-none shadow-sm flex items-center gap-1.5 w-fit mx-auto">
              <Sparkles size={11} className="animate-pulse" />
              <span>Careers</span>
            </span>
            <h1 className="mt-8 text-5xl sm:text-7xl font-black tracking-tight text-foreground leading-none">
              Join Our Remote Team
            </h1>
            <p className="mt-6 text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
              We are always looking for passionate engineers, designers, and project operations leads who value clean code, modern workflows, and type-safe systems.
            </p>
          </div>
        </SectionWrapper>
      </SpotlightGlow>

      {/* JOBS GRID */}
      <SectionWrapper className="border-t bg-muted/10 py-16 md:py-24 relative z-10">
        <div className="mx-auto max-w-5xl grid md:grid-cols-5 gap-8 items-start">
          
          {/* JOBS LISTING (3/5) */}
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground select-none">Open Positions</h2>
            {initialJobs.map((job, idx) => (
              <GlassCard
                key={idx}
                tilt={false}
                onClick={() => setSelectedJob(job.title)}
                className={`p-6 border bg-card/20 cursor-pointer hover:border-primary/30 hover:bg-card/45 transition-all duration-300 ${
                  selectedJob === job.title ? "ring-2 ring-primary border-transparent" : ""
                }`}
              >
                <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} className="text-primary" /> {job.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-primary" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-primary" /> {job.type}
                  </span>
                </div>
                <div className="mt-4 text-sm font-bold text-primary">
                  {job.salary}
                </div>
              </GlassCard>
            ))}
          </div>

          {/* APPLICATION FORM (2/5) */}
          <div className="md:col-span-2">
            <GlassCard
              tilt={false}
              className="p-6 border bg-card/25"
            >
              <h2 className="text-lg font-bold tracking-tight mb-6">
                Apply {selectedJob ? `for ${selectedJob}` : "Now"}
              </h2>
              {success ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 mx-auto">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Application Dispatched!</h3>
                    <p className="text-xs text-muted-foreground mt-2 font-medium leading-relaxed">
                      Thank you for applying. Our engineering board will review your profile credentials.
                    </p>
                  </div>
                  <Button onClick={() => setSuccess(false)} className="w-full mt-4 h-10 text-xs">
                    Apply Again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-medium text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Selected Role
                    </label>
                    <Input
                      value={selectedJob || "Select a role on the left"}
                      readOnly
                      className="mt-1 bg-muted/40 cursor-default focus:ring-0 focus:border-border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Full Name
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Resume URL
                    </label>
                    <Input
                      type="url"
                      placeholder="https://dropbox.com/s/my-resume.pdf"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="mt-1 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      placeholder="Tell us why you are a great fit..."
                      value={cover}
                      onChange={(e) => setCover(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-border/80 bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary min-h-[100px] transition-all duration-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-xs font-bold shadow-lg shadow-primary/10 transition-all duration-300"
                    disabled={!selectedJob}
                  >
                    Submit Application
                  </Button>
                </form>
              )}
            </GlassCard>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
}
