import Link from "next/link";
import { FolderKanban, Calendar } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function PortalProjects() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", user?.id || "");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Projects</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review, track status, and monitor deliverables for all your contracts.
        </p>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 border rounded-xl bg-background flex flex-col justify-between space-y-6"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {project.name}
                  </h2>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-muted uppercase">
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Calendar size={14} />
                  <span>
                    Timeline: {project.start_date || "TBD"} &mdash; {project.end_date || "TBD"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Link
                  href={`/portal/projects/${project.id}`}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 shadow transition-all"
                >
                  Enter Workspace
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 border rounded-xl bg-background text-center flex flex-col items-center justify-center space-y-3 max-w-lg mx-auto mt-12">
          <FolderKanban size={40} className="text-muted-foreground/50" />
          <h2 className="font-bold text-lg">No Projects Found</h2>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any project contracts assigned yet. Reach out to our team to get started!
          </p>
          <Link
            href="/contact"
            className="mt-4 rounded-lg border px-4 py-2 text-xs font-semibold hover:bg-muted transition"
          >
            Contact Inquiry
          </Link>
        </div>
      )}
    </div>
  );
}
