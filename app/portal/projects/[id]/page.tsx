import { notFound } from "next/navigation";
import { Calendar, CheckCircle2, MessageSquare, ListTodo, AlertCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitPortalCommentAction } from "@/lib/backend/actions/portal-actions";

interface CommentProfile {
  full_name: string | null;
  role: string;
}

interface CommentWithProfile {
  id: string;
  content: string;
  created_at: string;
  profiles: CommentProfile | null;
}

async function postComment(formData: FormData) {
  "use server";
  const projectId = formData.get("projectId") as string;
  const content = formData.get("content") as string;

  if (!projectId || !content) return;

  await submitPortalCommentAction(projectId, content);
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectWorkspace({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch project details
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("client_id", user?.id || "")
    .single();

  if (!project) {
    notFound();
  }

  // Fetch milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("project_id", id)
    .order("due_date", { ascending: true });

  // Fetch tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", id)
    .order("due_date", { ascending: true });

  // Fetch comments
  const { data: commentsData } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      profiles (
        full_name,
        role
      )
    `)
    .eq("project_id", id)
    .order("created_at", { ascending: true });

  const comments = (commentsData as unknown as CommentWithProfile[]) || [];

  return (
    <div className="space-y-8 relative z-10">
      {/* HEADER SECTION */}
      <div className="p-6 rounded-2xl border bg-card/45 backdrop-blur-md glass-panel flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/10 select-none">
            Project Board
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-3">{project.name}</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1.5 font-medium leading-relaxed max-w-xl">
            {project.description || "No project overview description provided."}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2 text-left md:text-right">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/5 select-none">
            {project.status}
          </span>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-semibold select-none">
            <Calendar size={13} className="text-primary" />
            <span>Target End: {project.end_date || "TBD"}</span>
          </div>
        </div>
      </div>

      {/* METRICS TRACK */}
      <div className="p-6 rounded-2xl border bg-card/30 backdrop-blur-md glass-panel space-y-4">
        <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
          <span className="text-muted-foreground">Overall Milestone Progress</span>
          <span className="text-primary">{project.progress}%</span>
        </div>
        <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* THREE-COLUMN WORKSPACE GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* MILESTONES & TASKS COLUMNS (Left 2/3) */}
        <div className="md:col-span-2 space-y-8">
          {/* MILESTONES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Milestones Sprints</h2>
            </div>
            {milestones && milestones.length > 0 ? (
              <div className="border rounded-2xl bg-card/30 backdrop-blur-md glass-panel divide-y divide-border/40 overflow-hidden">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-muted/10 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-foreground">{milestone.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 font-medium">{milestone.description}</div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border select-none ${
                      milestone.status === "completed" 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                        : "bg-muted/40 text-muted-foreground"
                    }`}>
                      {milestone.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 border rounded-2xl bg-card/30 backdrop-blur-md text-center text-xs text-muted-foreground glass-panel select-none">
                No active milestones defined.
              </div>
            )}
          </div>

          {/* TASKS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ListTodo size={18} className="text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Sprints Backlog</h2>
            </div>
            {tasks && tasks.length > 0 ? (
              <div className="border rounded-2xl bg-card/30 backdrop-blur-md glass-panel divide-y divide-border/40 overflow-hidden">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-muted/10 transition-colors">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{task.title}</div>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 select-none">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        task.priority === "high" 
                          ? "bg-red-500/10 border-red-500/20 text-red-500" 
                          : "bg-muted/40 text-muted-foreground"
                      }`}>
                        {task.priority}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        task.status === "done" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                          : "bg-muted/40 text-muted-foreground"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 border rounded-2xl bg-card/30 backdrop-blur-md text-center text-xs text-muted-foreground glass-panel select-none">
                No backlog tasks logged.
              </div>
            )}
          </div>
        </div>

        {/* MESSAGING / DISCUSSIONS SIDEBAR (Right 1/3) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">Workspace Dialogue</h2>
          </div>
          <Card className="border bg-card/45 backdrop-blur-md glass-panel shadow-sm rounded-2xl">
            <CardContent className="p-4 space-y-4">
              <div className="h-[340px] overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                {comments && comments.length > 0 ? (
                  comments.map((comm) => (
                    <div key={comm.id} className="space-y-1 hover:bg-muted/10 p-1 rounded-lg transition-colors">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-xs font-bold text-foreground">
                          {comm.profiles ? comm.profiles.full_name : "Anonymous User"}
                        </span>
                        <span className="text-[9px] font-black uppercase text-primary/70">
                          {comm.profiles ? comm.profiles.role : ""}
                        </span>
                      </div>
                      <div className="p-3 bg-muted/40 rounded-xl text-xs leading-normal font-medium text-foreground">
                        {comm.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-16 flex flex-col items-center justify-center space-y-2 select-none">
                    <AlertCircle size={24} className="text-muted-foreground/35" />
                    <span>No workspace discussion yet. Post a message below to coordinate sprints!</span>
                  </div>
                )}
              </div>

              {/* POST COMMENT FORM */}
              <form action={postComment} className="border-t border-border/40 pt-4 space-y-2">
                <input type="hidden" name="projectId" value={project.id} />
                <Input
                  name="content"
                  placeholder="Type a sprint feedback comment..."
                  required
                  className="text-xs focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
                />
                <Button type="submit" className="w-full text-xs py-1 h-9 rounded-xl font-bold shadow-sm">
                  Post Comment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
