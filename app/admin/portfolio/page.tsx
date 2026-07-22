"use client";

import { useEffect, useState, useCallback } from "react";
import { FolderClosed, Trash, CheckCircle2, Edit2, Plus, X, Upload } from "lucide-react";
import {
  savePortfolioProjectAction,
  updatePortfolioProjectAction,
  deletePortfolioProjectAction,
  listPortfolioProjectsAction
} from "@/lib/backend/actions/cms-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/browser";

interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  image_url?: string | null;
  video_url?: string | null;
  gallery_urls?: string[] | null;
  technologies?: string[] | null;
  challenge?: string | null;
  solution?: string | null;
  testimonial_quote?: string | null;
  testimonial_author?: string | null;
  testimonial_role?: string | null;
  metrics?: { label: string; value: number; suffix: string }[] | null;
  process_steps?: { phase: string; title: string; desc: string }[] | null;
  client_name?: string | null;
  project_date?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
}

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);

  // Form states
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "specs" | "seo">("basic");

  // Helper inputs for dynamic arrays
  const [techInput, setTechInput] = useState("");
  
  // Metrics local fields
  const [m1, setM1] = useState({ label: "", value: "", suffix: "" });
  const [m2, setM2] = useState({ label: "", value: "", suffix: "" });
  const [m3, setM3] = useState({ label: "", value: "", suffix: "" });

  // Process steps local fields
  const [s1, setS1] = useState({ phase: "Phase 01", title: "", desc: "" });
  const [s2, setS2] = useState({ phase: "Phase 02", title: "", desc: "" });
  const [s3, setS3] = useState({ phase: "Phase 03", title: "", desc: "" });
  const [s4, setS4] = useState({ phase: "Phase 04", title: "", desc: "" });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const res = await listPortfolioProjectsAction();
    if (res.success) {
      setProjects((res.data as PortfolioProject[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Sync helper states when editing project changes
  useEffect(() => {
    if (editingProject) {
      setTechInput(editingProject.technologies?.join(", ") || "");
      
      const metrics = Array.isArray(editingProject.metrics) ? editingProject.metrics : [];
      setM1(metrics[0] ? { label: metrics[0].label, value: String(metrics[0].value), suffix: metrics[0].suffix } : { label: "", value: "", suffix: "" });
      setM2(metrics[1] ? { label: metrics[1].label, value: String(metrics[1].value), suffix: metrics[1].suffix } : { label: "", value: "", suffix: "" });
      setM3(metrics[2] ? { label: metrics[2].label, value: String(metrics[2].value), suffix: metrics[2].suffix } : { label: "", value: "", suffix: "" });

      const steps = Array.isArray(editingProject.process_steps) ? editingProject.process_steps : [];
      setS1(steps[0] || { phase: "Phase 01", title: "", desc: "" });
      setS2(steps[1] || { phase: "Phase 02", title: "", desc: "" });
      setS3(steps[2] || { phase: "Phase 03", title: "", desc: "" });
      setS4(steps[3] || { phase: "Phase 04", title: "", desc: "" });
    } else {
      setTechInput("");
      setM1({ label: "", value: "", suffix: "" });
      setM2({ label: "", value: "", suffix: "" });
      setM3({ label: "", value: "", suffix: "" });
      setS1({ phase: "Phase 01", title: "", desc: "" });
      setS2({ phase: "Phase 02", title: "", desc: "" });
      setS3({ phase: "Phase 03", title: "", desc: "" });
      setS4({ phase: "Phase 04", title: "", desc: "" });
    }
  }, [editingProject]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    const maxBytes = type === "image" ? 5 * 1024 * 1024 : 25 * 1024 * 1024;
    const allowedTypes = type === "image"
      ? ["image/png", "image/jpeg", "image/webp", "image/gif"]
      : ["video/mp4", "video/webm", "video/quicktime"];

    if (!allowedTypes.includes(file.type)) {
      alert(`Only ${type === "image" ? "image" : "video"} files of supported types are allowed.`);
      return;
    }

    if (file.size > maxBytes) {
      alert(`File exceeds the ${type === "image" ? "5MB" : "25MB"} limit.`);
      return;
    }

    setUploading(type);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop()?.toLowerCase() || (type === "image" ? "png" : "mp4");
      const filePath = `portfolio/${Date.now()}_${type}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      if (type === "image") {
        setEditingProject(prev => ({ ...prev, image_url: publicUrl }));
      } else {
        setEditingProject(prev => ({ ...prev, video_url: publicUrl }));
      }
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploading(null);
    }
  };

  const handleSavePortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.slug) return;
    setSaving(true);

    try {
      // Gather technologies
      const technologies = techInput
        ? techInput.split(",").map(t => t.trim()).filter(Boolean)
        : [];

      // Gather metrics
      const metrics = [m1, m2, m3]
        .filter(m => m.label && m.value !== "")
        .map(m => ({ label: m.label, value: Number(m.value), suffix: m.suffix }));

      // Gather process steps
      const process_steps = [s1, s2, s3, s4]
        .filter(s => s.title && s.desc);

      const normalizeOptional = (value?: string | null) => {
        if (typeof value !== "string") return null;
        const trimmed = value.trim();
        return trimmed === "" ? null : trimmed;
      };

      const payload = {
        title: editingProject.title.trim(),
        slug: editingProject.slug.trim(),
        description: editingProject.description?.trim() || "",
        category: (editingProject.category || "Custom Software").trim(),
        status: (editingProject.status as "draft" | "published") || "draft",
        featured: !!editingProject.featured,
        image_url: normalizeOptional(editingProject.image_url),
        video_url: normalizeOptional(editingProject.video_url),
        gallery_urls: Array.isArray(editingProject.gallery_urls) ? editingProject.gallery_urls.map((url) => url.trim()).filter(Boolean) : [],
        technologies,
        challenge: normalizeOptional(editingProject.challenge),
        solution: normalizeOptional(editingProject.solution),
        testimonial_quote: normalizeOptional(editingProject.testimonial_quote),
        testimonial_author: normalizeOptional(editingProject.testimonial_author),
        testimonial_role: normalizeOptional(editingProject.testimonial_role),
        client_name: normalizeOptional(editingProject.client_name),
        project_date: normalizeOptional(editingProject.project_date) || new Date().toISOString().split("T")[0],
        seo_title: normalizeOptional(editingProject.seo_title),
        seo_description: normalizeOptional(editingProject.seo_description),
        metrics,
        process_steps,
      };

      let res;
      if (editingProject.id) {
        res = await updatePortfolioProjectAction(editingProject.id, payload);
      } else {
        res = await savePortfolioProjectAction(payload);
      }

      if (!res.success) {
        throw new Error(res.error);
      }

      setSuccess(true);
      setEditingProject(null);
      await fetchProjects();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(`Save error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this portfolio project?")) return;

    try {
      const res = await deletePortfolioProjectAction(itemId);
      if (!res.success) throw new Error(res.error);
      await fetchProjects();
    } catch (err) {
      alert(`Delete error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="space-y-8 select-none text-foreground pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Portfolio CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Publish agency case studies, upload dynamic media assets, organize categories, and configure meta tags.
          </p>
        </div>
        {!editingProject && (
          <Button
            onClick={() => setEditingProject({
              title: "",
              slug: "",
              description: "",
              category: "Web Application",
              status: "draft",
              featured: false,
              image_url: "",
              video_url: "",
              technologies: [],
              challenge: "",
              solution: "",
              testimonial_quote: "",
              testimonial_author: "",
              testimonial_role: "",
              client_name: "",
              project_date: new Date().toISOString().split("T")[0],
              seo_title: "",
              seo_description: "",
              metrics: [],
              process_steps: [],
            })}
            className="flex items-center gap-1.5 font-bold text-xs"
          >
            <Plus size={14} /> Add Project
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* CATALOG */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold tracking-tight">Project Catalog</h2>
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground font-mono">Synchronizing Portfolio database...</div>
          ) : projects.length > 0 ? (
            <div className="grid gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 border rounded-xl bg-card flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{proj.title}</h3>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="font-semibold">{proj.category}</span>
                      <span>&bull;</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        proj.status === "published" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/25"
                      }`}>
                        {proj.status}
                      </span>
                      {proj.featured && (
                        <>
                          <span>&bull;</span>
                          <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold">
                            Featured
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingProject(proj)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 size={12} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(proj.id)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive border-destructive/20 hover:bg-destructive/10"
                    >
                      <Trash size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 border rounded-xl bg-card text-center flex flex-col items-center justify-center space-y-2">
              <FolderClosed size={32} className="text-muted-foreground/50" />
              <div className="text-sm font-semibold">No portfolio projects</div>
            </div>
          )}
        </div>

        {/* CMS FORM */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-bold tracking-tight">Project Editor</h2>
          {editingProject ? (
            <Card className="border bg-card">
              <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-bold">
                    {editingProject.id ? "Edit Project Details" : "New Project Specs"}
                  </CardTitle>
                  <CardDescription className="text-[10px]">
                    Configure showcase variables, media assets, metrics, and SEO attributes.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditingProject(null)} className="h-7 w-7 p-0">
                  <X size={14} />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {success && (
                  <div className="p-3 text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2 font-medium dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 size={14} />
                    Portfolio item successfully updated!
                  </div>
                )}

                {/* Tab buttons */}
                <div className="flex border-b border-border/80 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("basic")}
                    className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${activeTab === "basic" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                  >
                    Basic Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("specs")}
                    className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${activeTab === "specs" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                  >
                    Case Study Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("seo")}
                    className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${activeTab === "seo" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                  >
                    SEO & Metrics
                  </button>
                </div>

                <form onSubmit={handleSavePortfolioItem} className="space-y-4 font-semibold text-foreground">
                  {/* TAB 1: BASIC INFO */}
                  {activeTab === "basic" && (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="p_title">Title</Label>
                          <Input
                            id="p_title"
                            placeholder="E.g. FinTech Billing Tool"
                            value={editingProject.title || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="p_slug">Unique Slug</Label>
                          <Input
                            id="p_slug"
                            placeholder="e.g. fintech-billing"
                            value={editingProject.slug || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="p_desc">Short Description</Label>
                        <Textarea
                          id="p_desc"
                          placeholder="Short summary of work..."
                          value={editingProject.description || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="p_cat">Category</Label>
                          <Input
                            id="p_cat"
                            placeholder="E.g. Web Application"
                            value={editingProject.category || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="p_client">Client Name</Label>
                          <Input
                            id="p_client"
                            placeholder="E.g. FinTech Corp"
                            value={editingProject.client_name || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, client_name: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="p_date">Project Date (YYYY-MM-DD)</Label>
                          <Input
                            id="p_date"
                            placeholder="YYYY-MM-DD"
                            value={editingProject.project_date || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, project_date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="p_status">Publication Status</Label>
                          <select
                            id="p_status"
                            className="w-full border border-input rounded-md h-9 px-2 bg-transparent text-xs"
                            value={editingProject.status || "draft"}
                            onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                          >
                            <option value="draft">Draft (Admin Only)</option>
                            <option value="published">Published (Public Portal)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={editingProject.featured || false}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                        />
                        <Label htmlFor="featured" className="cursor-pointer">
                          Feature on Homepage
                        </Label>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CASE STUDY SPECS */}
                  {activeTab === "specs" && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="p_challenge">The Challenge</Label>
                        <Textarea
                          id="p_challenge"
                          placeholder="Describe client difficulties and pain points..."
                          value={editingProject.challenge || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                          className="min-h-[90px]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="p_solution">The Solution</Label>
                        <Textarea
                          id="p_solution"
                          placeholder="Describe technical solutions and implementation roadmap..."
                          value={editingProject.solution || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                          className="min-h-[90px]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="p_tech">Technologies (Comma-separated)</Label>
                        <Input
                          id="p_tech"
                          placeholder="E.g. Next.js, Supabase, TypeScript, Framer Motion"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                        />
                      </div>

                      {/* Image direct upload */}
                      <div className="space-y-2 border-t pt-4">
                        <Label className="block text-xs font-bold text-foreground">Thumbnail Display Image</Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            placeholder="/images/portfolio/project-mockup.png"
                            value={editingProject.image_url || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                            className="flex-1"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="upload_image"
                              onChange={(e) => handleFileUpload(e, "image")}
                              disabled={uploading !== null}
                            />
                            <Label htmlFor="upload_image">
                              <Button type="button" variant="outline" className="flex items-center gap-1 cursor-pointer h-9 px-3 text-xs font-bold">
                                <Upload size={12} /> {uploading === "image" ? "Uploading..." : "Upload File"}
                              </Button>
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Video direct upload */}
                      <div className="space-y-2 border-t pt-2">
                        <Label className="block text-xs font-bold text-foreground">Case Study Video URL</Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            placeholder="E.g. https://domain.com/video.mp4"
                            value={editingProject.video_url || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, video_url: e.target.value })}
                            className="flex-1"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              id="upload_video"
                              onChange={(e) => handleFileUpload(e, "video")}
                              disabled={uploading !== null}
                            />
                            <Label htmlFor="upload_video">
                              <Button type="button" variant="outline" className="flex items-center gap-1 cursor-pointer h-9 px-3 text-xs font-bold">
                                <Upload size={12} /> {uploading === "video" ? "Uploading..." : "Upload File"}
                              </Button>
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Quote specs */}
                      <div className="space-y-3 border-t pt-4">
                        <Label className="block text-xs font-bold text-foreground">Client Testimonial Quote</Label>
                        <Textarea
                          placeholder="Client quote copy..."
                          value={editingProject.testimonial_quote || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, testimonial_quote: e.target.value })}
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label>Author Name</Label>
                            <Input
                              placeholder="E.g. Zainab Malik"
                              value={editingProject.testimonial_author || ""}
                              onChange={(e) => setEditingProject({ ...editingProject, testimonial_author: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Author Role</Label>
                            <Input
                              placeholder="E.g. COO, Apex Group"
                              value={editingProject.testimonial_role || ""}
                              onChange={(e) => setEditingProject({ ...editingProject, testimonial_role: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SEO & METRICS & PROCESS */}
                  {activeTab === "seo" && (
                    <div className="space-y-4">
                      {/* SEO Meta */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-primary">SEO Metadata</h4>
                        <div className="space-y-1.5">
                          <Label htmlFor="p_seot">Meta SEO Title</Label>
                          <Input
                            id="p_seot"
                            placeholder="Zorvate Portfolio Case Study"
                            value={editingProject.seo_title || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, seo_title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="p_seod">Meta SEO Description</Label>
                          <Textarea
                            id="p_seod"
                            placeholder="Read about Zorvate technical engineering execution..."
                            value={editingProject.seo_description || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, seo_description: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* 3 Measurable metrics */}
                      <div className="space-y-3 border-t pt-4">
                        <h4 className="text-xs font-bold text-primary">Measurable Client Results</h4>
                        <div className="grid gap-3">
                          {/* Metric 1 */}
                          <div className="grid sm:grid-cols-3 gap-2 border p-2.5 rounded-lg bg-card/40">
                            <div className="space-y-1">
                              <Label className="text-[10px]">Metric 1 Label</Label>
                              <Input placeholder="E.g. Speedup" value={m1.label} onChange={(e) => setM1({ ...m1, label: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Value (Number)</Label>
                              <Input placeholder="E.g. 150" type="number" step="any" value={m1.value} onChange={(e) => setM1({ ...m1, value: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Suffix</Label>
                              <Input placeholder="E.g. %" value={m1.suffix} onChange={(e) => setM1({ ...m1, suffix: e.target.value })} />
                            </div>
                          </div>

                          {/* Metric 2 */}
                          <div className="grid sm:grid-cols-3 gap-2 border p-2.5 rounded-lg bg-card/40">
                            <div className="space-y-1">
                              <Label className="text-[10px]">Metric 2 Label</Label>
                              <Input placeholder="E.g. Uptime" value={m2.label} onChange={(e) => setM2({ ...m2, label: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Value (Number)</Label>
                              <Input placeholder="E.g. 99.9" type="number" step="any" value={m2.value} onChange={(e) => setM2({ ...m2, value: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Suffix</Label>
                              <Input placeholder="E.g. %" value={m2.suffix} onChange={(e) => setM2({ ...m2, suffix: e.target.value })} />
                            </div>
                          </div>

                          {/* Metric 3 */}
                          <div className="grid sm:grid-cols-3 gap-2 border p-2.5 rounded-lg bg-card/40">
                            <div className="space-y-1">
                              <Label className="text-[10px]">Metric 3 Label</Label>
                              <Input placeholder="E.g. Assets" value={m3.label} onChange={(e) => setM3({ ...m3, label: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Value (Number)</Label>
                              <Input placeholder="E.g. 10" type="number" step="any" value={m3.value} onChange={(e) => setM3({ ...m3, value: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Suffix</Label>
                              <Input placeholder="E.g. k+" value={m3.suffix} onChange={(e) => setM3({ ...m3, suffix: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4 Process steps */}
                      <div className="space-y-3 border-t pt-4">
                        <h4 className="text-xs font-bold text-primary">Milestones Progression (Development Steps)</h4>
                        <div className="grid gap-4">
                          {/* Step 1 */}
                          <div className="border p-2.5 rounded-lg bg-card/40 space-y-2">
                            <div className="grid sm:grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[10px]">Phase</Label>
                                <Input value={s1.phase} onChange={(e) => setS1({ ...s1, phase: e.target.value })} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px]">Title</Label>
                                <Input placeholder="Strategy Mapping" value={s1.title} onChange={(e) => setS1({ ...s1, title: e.target.value })} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Description</Label>
                              <Input placeholder="Requirement details..." value={s1.desc} onChange={(e) => setS1({ ...s1, desc: e.target.value })} />
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="border p-2.5 rounded-lg bg-card/40 space-y-2">
                            <div className="grid sm:grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[10px]">Phase</Label>
                                <Input value={s2.phase} onChange={(e) => setS2({ ...s2, phase: e.target.value })} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px]">Title</Label>
                                <Input placeholder="UX Interface Design" value={s2.title} onChange={(e) => setS2({ ...s2, title: e.target.value })} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Description</Label>
                              <Input placeholder="Visual assets..." value={s2.desc} onChange={(e) => setS2({ ...s2, desc: e.target.value })} />
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="border p-2.5 rounded-lg bg-card/40 space-y-2">
                            <div className="grid sm:grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[10px]">Phase</Label>
                                <Input value={s3.phase} onChange={(e) => setS3({ ...s3, phase: e.target.value })} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px]">Title</Label>
                                <Input placeholder="Implementation Coding" value={s3.title} onChange={(e) => setS3({ ...s3, title: e.target.value })} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Description</Label>
                              <Input placeholder="Compiling source codes..." value={s3.desc} onChange={(e) => setS3({ ...s3, desc: e.target.value })} />
                            </div>
                          </div>

                          {/* Step 4 */}
                          <div className="border p-2.5 rounded-lg bg-card/40 space-y-2">
                            <div className="grid sm:grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[10px]">Phase</Label>
                                <Input value={s4.phase} onChange={(e) => setS4({ ...s4, phase: e.target.value })} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px]">Title</Label>
                                <Input placeholder="Performance Tuning" value={s4.title} onChange={(e) => setS4({ ...s4, title: e.target.value })} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Description</Label>
                              <Input placeholder="Audit check benchmarks..." value={s4.desc} onChange={(e) => setS4({ ...s4, desc: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <Button type="submit" disabled={saving} className="w-full h-10 font-bold">
                      {saving ? "Saving Specs..." : "Save Project"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="p-8 border rounded-xl bg-card/40 text-center text-xs text-muted-foreground font-semibold italic">
              Select a project from the catalog to edit, or click Add Project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
