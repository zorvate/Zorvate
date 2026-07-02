"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/browser";
import { updatePortalProfileAction } from "@/lib/backend/actions/portal-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PortalSettings() {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (profile) {
      setValue("fullName", profile.full_name || "");
      setValue("avatarUrl", profile.avatar_url || "");
    }
    setLoading(false);
  }, [supabase, setValue]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!currentUser) return;
    setSaving(true);
    setSuccess(false);

    const res = await updatePortalProfileAction({
      fullName: values.fullName,
      avatarUrl: values.avatarUrl,
    });

    setSaving(false);
    if (res.success) {
      setSuccess(true);
    } else {
      alert(`Update error: ${res.error}`);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground text-sm">Loading settings details...</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal workspace details and configure public profiles.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border bg-background">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription className="text-xs">
              Change your display name and update avatar link settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success && (
              <div className="p-3 text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2 font-medium dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 size={16} />
                Profile details saved successfully!
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email Address (Read-only)</Label>
                <Input
                  id="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="mt-1 bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fullName">Display Name</Label>
                <Input
                  id="fullName"
                  placeholder="Your Name"
                  className="mt-1"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive mt-1 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="avatarUrl">Avatar Image Link</Label>
                <Input
                  id="avatarUrl"
                  placeholder="https://example.com/avatar.jpg"
                  className="mt-1"
                  {...register("avatarUrl")}
                />
                {errors.avatarUrl && (
                  <p className="text-xs text-destructive mt-1 font-medium">{errors.avatarUrl.message}</p>
                )}
              </div>

              <Button type="submit" disabled={saving} className="mt-2">
                {saving ? "Saving..." : "Save Profile Details"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
