"use client";

import { useEffect, useState, useCallback } from "react";
import { FolderKanban, CheckCircle2, Trash2 } from "lucide-react";
import { createProjectAction, updateProjectAction, deleteProjectAction, listProjectsAction } from "@/lib/backend/actions/project-actions";
import { listProfilesAction } from "@/lib/backend/actions/profile-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientProfile {
  id: string;
  full_name: string;
  role: string;
}

interface ClientProject {
  id: string;
  client_id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  created_at: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [clientId, setClientId] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("planning");
  const [success, setSuccess] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const projRes = await listProjectsAction();
    const clientRes = await listProfilesAction();

    if (projRes.success) {
      setProjects((projRes.data as ClientProject[]) || []);
    }
    if (clientRes.success) {
      const filteredClients = (clientRes.data as ClientProfile[]).filter(c => c.role === "client");
      setClients(filteredClients);
      if (filteredClients.length > 0 && !clientId) {
        setClientId(filteredClients[0].id);
      }
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientId || creating) return;

    setCreating(true);
    try {
      const res = await createProjectAction({
        name,
        description: desc,
        client_id: clientId,
        status: status as "planning" | "active" | "completed" | "on_hold",
        progress,
      });

      if (!res.success) {
        alert(`Create error: ${res.error}`);
      } else {
        setSuccess(true);
        setName("");
        setDesc("");
        setProgress(0);
        setStatus("planning");
        await fetchData();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateProgress = async (projectId: string, newProg: number) => {
    const res = await updateProjectAction(projectId, { progress: newProg });
    if (!res.success) {
      alert(`Update progress error: ${res.error}`);
    } else {
      await fetchData();
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Delete this project and its associated records?")) return;

    const res = await deleteProjectAction(projectId);
    if (!res.success) {
      alert(`Delete error: ${res.error}`);
    } else {
      await fetchData();
    }
  };

  return (
    <div className="space-y-8 select-none text-foreground">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Manage Projects</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Initiate new client contracts, assign milestones, and log progress updates.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* PROJECTS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Active Accounts</h2>
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground font-mono">Synchronizing Projects database...</div>
          ) : projects.length > 0 ? (
            <div className="grid gap-4">
              {projects.map((proj) => {
                const clientObj = clients.find((c) => c.id === proj.client_id);
                return (
                  <div key={proj.id} className="p-5 border rounded-xl bg-card space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-foreground">{proj.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Client Account: <span className="font-bold text-foreground">{clientObj?.full_name || "Unknown Client"}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-primary/10 text-primary border border-primary/20">
                        {proj.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                      {proj.description || "No project specs provided."}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Milestone Progress</span>
                        <span>{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${proj.progress}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                      <select
                        className="border border-border/80 rounded px-2 py-1 text-[11px] bg-transparent font-semibold"
                        value={proj.progress}
                        onChange={(e) => handleUpdateProgress(proj.id, Number(e.target.value))}
                      >
                        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
                          <option key={v} value={v}>
                            {v}% Complete
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => handleDeleteProject(proj.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 border rounded-xl bg-card text-center flex flex-col items-center justify-center space-y-2">
              <FolderKanban size={32} className="text-muted-foreground/50" />
              <div className="text-sm font-semibold">No active projects</div>
            </div>
          )}
        </div>

        {/* CREATE FORM */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Initiate Contract</h2>
          <Card className="border bg-card">
            <CardHeader>
              <CardTitle className="text-sm">Contract Details</CardTitle>
              <CardDescription className="text-xs">
                Launch a workspace linked to an onboarded client profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold">
              {success && (
                <div className="p-3 text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2 font-medium dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 size={14} />
                  Contract initialized successfully!
                </div>
              )}

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Workspace Name</label>
                  <Input
                    placeholder="E.g. Web3 Analytics Dashboard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Select Client Account</label>
                  <select
                    className="w-full border border-input rounded-md h-9 px-2 bg-transparent text-xs"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name}
                      </option>
                    ))}
                    {clients.length === 0 && (
                      <option disabled>No clients registered</option>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Specs / Description</label>
                  <textarea
                    placeholder="Enter project terms, design assets list, and developer stack..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full border border-input rounded-md px-3 py-2 text-xs bg-transparent min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Status</label>
                    <select
                      className="w-full border border-input rounded-md h-9 px-2 bg-transparent text-xs"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Initial Progress</label>
                    <select
                      className="w-full border border-input rounded-md h-9 px-2 bg-transparent text-xs"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                    >
                      {[0, 10, 25, 50, 75, 100].map((p) => (
                        <option key={p} value={p}>
                          {p}%
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button type="submit" disabled={creating || !name || !clientId} className="w-full h-10 font-bold">
                  {creating ? "Initializing..." : "Initialize Contract"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
