"use client";

import { useEffect, useState, useCallback } from "react";
import { Download } from "lucide-react";
import { listJobApplicationsAction, updateJobApplicationStatusAction } from "@/lib/backend/actions/careers-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface JobApplication {
  id: string;
  job_id: string;
  name: string;
  email: string;
  resume_path: string;
  cover_letter?: string;
  status: string;
  created_at: string;
}

export default function AdminCareers() {
  const [applicants, setApplicants] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    const res = await listJobApplicationsAction();
    if (res.success) {
      setApplicants((res.data as JobApplication[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    const res = await updateJobApplicationStatusAction(appId, newStatus);
    if (!res.success) {
      alert(`Error updating status: ${res.error}`);
    } else {
      await fetchApplicants();
    }
  };

  return (
    <div className="space-y-8 select-none text-foreground">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Job Applicants</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review candidates applying for open positions and track pipeline status.
        </p>
      </div>

      <Card className="border bg-card">
        <CardHeader>
          <CardTitle>Resume Inbox</CardTitle>
          <CardDescription className="text-xs">
            Review submission materials, cover letters, and select filters.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 text-xs">
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground font-mono">Synchronizing Applicants database...</div>
          ) : applicants.length > 0 ? (
            <div className="divide-y border-t border-border/40">
              {applicants.map((app) => (
                <div key={app.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <span className="font-bold text-sm text-foreground">{app.name}</span>
                      <span className="text-xs text-muted-foreground">({app.email})</span>
                    </div>
                    {app.cover_letter && (
                      <p className="text-xs text-muted-foreground max-w-xl italic font-semibold">
                        &ldquo;{app.cover_letter}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
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
  );
}
