"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, Pencil, Trash2 } from "lucide-react";
import {
  listJobApplicationsAction,
  updateJobApplicationStatusAction,
  listJobsAction,
  saveJobAction,
  deleteJobAction,
} from "@/lib/backend/actions/careers-actions";
import { Job } from "@/lib/supabase/cms";
import { JobInputType } from "@/lib/validations/cms";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface JobApplication {
  id: string;
  job_id: string;
  name: string;
  email: string;
  resume_path: string;
  cover_letter?: string;
  status: string;
  created_at: string;
  jobs?: { id: string; title: string };
}

export default function AdminCareers() {
  const [applicants, setApplicants] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobForm, setJobForm] = useState<Partial<Job> | null>(null);
  const [savingJob, setSavingJob] = useState(false);
  const [jobSaved, setJobSaved] = useState(false);

  const fetchApplicants = useCallback(async () => {
    setLoadingApplicants(true);
    const res = await listJobApplicationsAction();
    if (res.success) {
      setApplicants((res.data as JobApplication[]) || []);
    }
    setLoadingApplicants(false);
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    const res = await listJobsAction();
    if (res.success) {
      setJobs((res.data as Job[]) || []);
    }
    setLoadingJobs(false);
  }, []);

  useEffect(() => {
    fetchApplicants();
    fetchJobs();
  }, [fetchApplicants, fetchJobs]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    const res = await updateJobApplicationStatusAction(appId, newStatus);
    if (!res.success) {
      alert(`Error updating status: ${res.error}`);
    } else {
      await fetchApplicants();
    }
  };

  const handleEditJob = (job: Job) => {
    setJobForm(job);
  };

  const handleResetJobForm = () => {
    setJobForm({ status: "open" });
    setJobSaved(false);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm) return;

    const payload: JobInputType = {
      id: jobForm.id,
      title: (jobForm.title || "").trim(),
      department: (jobForm.department || "").trim(),
      location: (jobForm.location || "").trim(),
      type: (jobForm.type || "").trim(),
      salary: (jobForm.salary || "").trim(),
      description: (jobForm.description || "").trim(),
      requirements: jobForm.requirements || [],
      benefits: jobForm.benefits || [],
      status: (jobForm.status || "open") as "open" | "closed",
    };

    setSavingJob(true);
    const res = await saveJobAction(payload);
    setSavingJob(false);

    if (!res.success) {
      alert(`Error saving job: ${res.error}`);
      return;
    }

    setJobSaved(true);
    setJobForm(null);
    await fetchJobs();
    setTimeout(() => setJobSaved(false), 3000);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Delete this job posting?")) return;
    const res = await deleteJobAction(jobId);
    if (!res.success) {
      alert(`Error deleting job: ${res.error}`);
      return;
    }
    await fetchJobs();
  };

  return (
    <div className="space-y-8 select-none text-foreground">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Careers Administration</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage live job postings, review incoming applications, and track candidate status.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_1fr]">
        <Card className="border bg-card">
          <CardHeader>
            <CardTitle>Job Postings</CardTitle>
            <CardDescription className="text-xs">
              Publish or archive roles that appear on the public careers page.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 text-xs">
            {loadingJobs ? (
              <div className="text-center py-12 text-sm text-muted-foreground font-mono">Loading job postings...</div>
            ) : jobs.length > 0 ? (
              <div className="divide-y border-t border-border/40">
                {jobs.map((job) => (
                  <div key={job.id} className="p-5 sm:flex sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground">{job.title}</h3>
                        <span className="text-[10px] uppercase tracking-widest bg-muted px-2 py-1 rounded-full text-muted-foreground">
                          {job.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {job.department} · {job.location} · {job.type}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
                      <Button size="sm" variant="outline" onClick={() => handleEditJob(job)}>
                        <Pencil size={14} /> Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-sm text-muted-foreground italic font-semibold border-t border-border/40">
                No job postings have been created yet.
              </div>
            )}
          </CardContent>
          <CardContent className="p-6 pt-0 text-xs">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold">{jobForm?.id ? "Edit Job" : "Create New Job"}</h2>
                <Button size="sm" variant="outline" onClick={handleResetJobForm}>
                  New Posting
                </Button>
              </div>

              {jobSaved && (
                <div className="p-3 rounded-lg bg-emerald-100 text-emerald-900 text-[11px] font-semibold">
                  Job posting saved successfully.
                </div>
              )}

              <form onSubmit={handleSaveJob} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="Job title"
                    value={jobForm?.title || ""}
                    onChange={(e) => setJobForm((prev) => ({ ...(prev || {}), title: e.target.value }))}
                    aria-label="Job title"
                  />
                  <Input
                    placeholder="Department"
                    value={jobForm?.department || ""}
                    onChange={(e) => setJobForm((prev) => ({ ...(prev || {}), department: e.target.value }))}
                    aria-label="Department"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="Location"
                    value={jobForm?.location || ""}
                    onChange={(e) => setJobForm((prev) => ({ ...(prev || {}), location: e.target.value }))}
                    aria-label="Location"
                  />
                  <Input
                    placeholder="Employment type"
                    value={jobForm?.type || ""}
                    onChange={(e) => setJobForm((prev) => ({ ...(prev || {}), type: e.target.value }))}
                    aria-label="Employment type"
                  />
                </div>

                <Input
                  placeholder="Salary range"
                  value={jobForm?.salary || ""}
                  onChange={(e) => setJobForm((prev) => ({ ...(prev || {}), salary: e.target.value }))}
                  aria-label="Salary"
                />

                <Textarea
                  placeholder="Job description"
                  value={jobForm?.description || ""}
                  onChange={(e) => setJobForm((prev) => ({ ...(prev || {}), description: e.target.value }))}
                  rows={4}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <select
                    className="w-full rounded-md border border-border/80 bg-transparent px-3 py-2 text-xs"
                    value={jobForm?.status || "open"}
                    onChange={(e) => setJobForm((prev) => ({ ...(prev || {}), status: e.target.value as "open" | "closed" }))}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                  <Button type="submit" disabled={savingJob} className="w-full">
                    {savingJob ? "Saving…" : "Save Job"}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader>
            <CardTitle>Resume Inbox</CardTitle>
            <CardDescription className="text-xs">
              Review submission materials, cover letters, and track candidate progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 text-xs">
            {loadingApplicants ? (
              <div className="text-center py-12 text-sm text-muted-foreground font-mono">Synchronizing Applicants database...</div>
            ) : applicants.length > 0 ? (
              <div className="divide-y border-t border-border/40">
                {applicants.map((app) => (
                  <div key={app.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{app.name}</span>
                        <span className="text-xs text-muted-foreground">({app.email})</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Role: {app.jobs?.title ?? app.job_id}
                      </p>
                      {app.cover_letter && (
                        <p className="text-xs text-muted-foreground max-w-xl italic font-semibold">
                          &ldquo;{app.cover_letter}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={app.resume_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-bold"
                      >
                        <Download size={14} /> Resume PDF
                      </a>

                      <select
                        className="border border-border/80 rounded px-2 py-1 text-xs bg-transparent capitalize font-semibold"
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offered">Offered</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-sm text-muted-foreground italic font-semibold border-t border-border/40">
                No job applications received yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
