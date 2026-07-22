"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Clock, ArrowUpRight } from "lucide-react";

import { createClient } from "@/lib/supabase/browser";
import { getJobs, Job } from "@/lib/supabase/cms";
import { submitJobApplicationAction } from "@/lib/backend/actions/careers-actions";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [cover, setCover] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || null;

  useEffect(() => {
    async function loadJobs() {
      setLoadingJobs(true);
      try {
        const supabase = createClient();
        const loadedJobs = await getJobs(supabase);
        setJobs(loadedJobs);
        if (loadedJobs.length > 0) {
          setSelectedJobId((prev) => prev || loadedJobs[0].id);
        }
      } catch (error) {
        console.error("Failed to load careers jobs:", error);
      } finally {
        setLoadingJobs(false);
      }
    }

    loadJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJobId || !name || !email || !resumeUrl) {
      alert("Please select a role and provide name, email, and resume URL.");
      return;
    }

    const res = await submitJobApplicationAction({
      job_id: selectedJobId,
      name: name.trim(),
      email: email.trim(),
      resume_path: resumeUrl.trim(),
      cover_letter: cover.trim() || null,
    });

    if (res.success) {
      setSuccess(true);
      setName("");
      setEmail("");
      setResumeUrl("");
      setCover("");
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      <section className="border-b border-border pt-32 pb-24">
        <SectionWrapper className="py-0">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl space-y-5">
              <span className="mono-label text-[10px] text-primary">01 / Careers</span>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Join the engineering team building durable digital systems.</h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">We recruit builders who care about structure, precision, and long-term product integrity. Roles span engineering, design, strategy, and delivery operations.</p>
            </div>
            <div className="panel-shell p-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">Team profile</div>
              <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Focus</span><span className="text-foreground">Remote-first</span></div>
                <div className="flex items-center justify-between border-b border-border/70 pb-3"><span>Work style</span><span className="text-foreground">High clarity</span></div>
                <div className="flex items-center justify-between"><span>Selection</span><span className="text-foreground">Craft over hype</span></div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      <SectionWrapper className="border-b border-border bg-surface/20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <span className="mono-label text-[10px] text-primary">02 / Open positions</span>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Select a role and begin the intake.</h2>
            <p className="text-sm leading-7 text-muted-foreground">Each opening is structured around a clear responsibility, mode of collaboration, and expected delivery scope.</p>
          </div>
          <div className="space-y-4">
            {jobs.length > 0 ? jobs.map((job) => (
              <button key={job.id} type="button" onClick={() => setSelectedJobId(job.id)} className={`w-full rounded-[var(--radius-md)] border p-5 text-left transition-colors ${selectedJobId === job.id ? "border-primary/50 bg-surface-secondary/80" : "border-border bg-surface/50 hover:border-border-hover"}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-foreground">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Briefcase className="size-3.5" />{job.department}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{job.location}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{job.type}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">{job.salary}</span>
                </div>
              </button>
            )) : loadingJobs ? <div className="rounded-[var(--radius-md)] border border-border bg-surface/50 p-6 text-sm text-muted-foreground">Loading available roles...</div> : <div className="rounded-[var(--radius-md)] border border-border bg-surface/50 p-6 text-sm text-muted-foreground">No open roles are available at the moment.</div>}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-background/70">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="panel-shell p-6 sm:p-8">
            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">03 / Application intake</div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Submit your profile for the selected role.</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">The intake is intentionally direct so the focus remains on relevant experience, craft, and fit.</p>
            {success ? <div className="mt-6 rounded-[var(--radius-md)] border border-border bg-surface/50 p-5 text-sm leading-7 text-muted-foreground">Application received. We will review your submission and follow up through the provided contact details.</div> : <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2"><label className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Selected role</label><Input value={selectedJob ? selectedJob.title : "Select a role"} readOnly /></div>
              <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Full name</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Mercer" /></div><div className="space-y-2"><label className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@studio.com" /></div></div>
              <div className="space-y-2"><label className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Resume URL</label><Input type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://..." /></div>
              <div className="space-y-2"><label className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Cover note</label><Textarea value={cover} onChange={(e) => setCover(e.target.value)} placeholder="A short note on your experience and fit..." /></div>
              <Button type="submit" className="w-full gap-2" disabled={!selectedJobId}>Submit application <ArrowUpRight className="size-4" /></Button>
            </form>}
          </div>
          <div className="panel-shell p-6 sm:p-8">
            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary">04 / What we seek</div>
            <div className="mt-4 space-y-3">
              {[
                "Builders with strong systems thinking and calm execution.",
                "Designers who understand structure, interaction, and clarity.",
                "Operators who can keep delivery moving without losing rigor."
              ].map((item) => <div key={item} className="rounded-[var(--radius-md)] border border-border bg-surface/50 p-4 text-sm leading-6 text-muted-foreground">{item}</div>)}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
