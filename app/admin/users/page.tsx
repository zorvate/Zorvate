"use client";

import { useEffect, useState, useCallback } from "react";
import { listProfilesAction, updateProfileAction } from "@/lib/backend/actions/profile-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const rolesList = ["client", "admin", "super-admin", "manager", "developer", "designer"];

interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await listProfilesAction();
    if (res.success) {
      setUsers((res.data as UserProfile[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    const res = await updateProfileAction(userId, { role: newRole });
    if (!res.success) {
      alert(`Error updating role: ${res.error}`);
    } else {
      await fetchUsers();
    }
    setUpdatingUserId(null);
  };

  return (
    <div className="space-y-8 select-none text-foreground">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Users & Roles</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage registered user access controls and assign database roles.
        </p>
      </div>

      <Card className="border bg-card">
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription className="text-xs">
            Review user profiles and modify RBAC rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 text-xs">
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground font-mono">Synchronizing Profiles database...</div>
          ) : users.length > 0 ? (
            <div className="divide-y border-t border-border/40">
              {users.map((profile) => (
                <div key={profile.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {profile.full_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {profile.full_name || "No name defined"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        ID: {profile.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Role:</span>
                    <select
                      className="border border-border/80 rounded px-2 py-1 text-xs bg-transparent capitalize font-semibold"
                      value={profile.role}
                      disabled={updatingUserId === profile.id}
                      onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                    >
                      {rolesList.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground italic font-semibold border-t border-border/40">
              No registered profiles found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
