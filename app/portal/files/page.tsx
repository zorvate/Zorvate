"use client";

import { useEffect, useState, useCallback } from "react";
import { FolderClosed, Upload, Download, Trash, FileText } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/browser";
import { uploadPortalFileAction, deletePortalFileAction } from "@/lib/backend/actions/portal-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Attachment {
  id: string;
  project_id: string;
  name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  created_at: string;
}

interface ProjectSelect {
  id: string;
  name: string;
}

export default function FileVault() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [projects, setProjects] = useState<ProjectSelect[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAttachments = useCallback(async (userId: string) => {
    const { data: userAttachments } = await supabase
      .from("attachments")
      .select("*")
      .eq("uploaded_by", userId);
    setAttachments((userAttachments as Attachment[]) || []);
  }, [supabase]);

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (!currentUser) return;

      // Fetch projects
      const { data: userProjects } = await supabase
        .from("projects")
        .select("id, name")
        .eq("client_id", currentUser.id);

      setProjects((userProjects as ProjectSelect[]) || []);
      if (userProjects && userProjects.length > 0) {
        setSelectedProjectId(userProjects[0].id);
      }

      // Fetch attachments
      await refreshAttachments(currentUser.id);
      setLoading(false);
    };

    fetchUserAndData();
  }, [supabase, refreshAttachments]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedProjectId || !user) return;

    setUploading(true);
    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `vault/${user.id}/${fileName}`;

    // Upload to bucket
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, file);

    if (uploadError) {
      alert(`Upload error: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    // Insert into attachments table using Server Action
    const res = await uploadPortalFileAction({
      projectId: selectedProjectId,
      name: file.name,
      filePath,
      fileSize: file.size,
      fileType: file.type || "application/octet-stream",
    });

    if (!res.success) {
      alert(`Database log error: ${res.error}`);
    } else {
      await refreshAttachments(user.id);
    }
    setUploading(false);
  };

  const handleDelete = async (attachment: Attachment) => {
    if (!user || !confirm("Are you sure you want to delete this file?")) return;

    const res = await deletePortalFileAction(attachment.id);

    if (!res.success) {
      alert(`Delete error: ${res.error}`);
    } else {
      await refreshAttachments(user.id);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">File Vault</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Securely manage and upload digital assets, prototypes, wireframes, and design guides.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* FILE LIST */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Your Stored Files</h2>
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Loading file lists...</div>
          ) : attachments.length > 0 ? (
            <div className="grid gap-4">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="p-4 border rounded-xl bg-background flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-md">
                        {file.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {file.file_type} &bull; {(file.file_size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={supabase.storage.from("media").getPublicUrl(file.file_path).data.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded"
                    >
                      <Download size={16} />
                    </a>
                    <button
                      onClick={() => handleDelete(file)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 border rounded-xl bg-background text-center flex flex-col items-center justify-center space-y-3">
              <FolderClosed size={36} className="text-muted-foreground/50" />
              <div className="font-semibold text-sm">No files uploaded yet</div>
              <p className="text-xs text-muted-foreground max-w-xs">
                Upload images, assets, or specifications related to your active projects on the right.
              </p>
            </div>
          )}
        </div>

        {/* UPLOAD FORM */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Upload Asset</h2>
          <Card className="border bg-background">
            <CardHeader>
              <CardTitle className="text-sm">Add New File</CardTitle>
              <CardDescription className="text-xs">
                Choose a project and upload your documents or mockups.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.length > 0 ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Select Project</label>
                    <select
                      className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-transparent"
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border border-dashed border-input rounded-xl p-6 text-center space-y-3 relative hover:border-primary/50 transition opacity-100 hover:opacity-90">
                    <Upload className="mx-auto text-muted-foreground" size={24} />
                    <div className="text-xs font-semibold text-muted-foreground">
                      Click to upload file
                    </div>
                    <Input
                      type="file"
                      disabled={uploading}
                      onChange={handleUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {uploading && (
                      <div className="text-xs font-semibold text-primary animate-pulse mt-2">
                        Uploading file now...
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-4">
                  You need an active project to upload attachments.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
