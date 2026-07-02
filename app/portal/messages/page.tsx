"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquare, Send } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/browser";
import { submitPortalMessageAction } from "@/lib/backend/actions/portal-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProjectItem {
  id: string;
  name: string;
}

interface MessageProfile {
  full_name?: string;
  role?: string;
}

interface MessageItem {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: MessageProfile | null;
}

export default function MessagingPage() {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async (projId: string) => {
    if (!projId) return;
    const { data: list } = await supabase
      .from("messages")
      .select(`
        id,
        content,
        created_at,
        sender_id,
        profiles (
          full_name,
          role
        )
      `)
      .eq("project_id", projId)
      .order("created_at", { ascending: true });

    setMessages((list as unknown as MessageItem[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (!user) return;

      const { data: userProjects } = await supabase
        .from("projects")
        .select("id, name")
        .eq("client_id", user.id);

      setProjects((userProjects as ProjectItem[]) || []);
      if (userProjects && userProjects.length > 0) {
        setSelectedProjectId(userProjects[0].id);
      } else {
        setLoading(false);
      }
    };

    fetchUserAndProjects();
  }, [supabase]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchMessages(selectedProjectId);

      // Set up real-time listener
      const channel = supabase
        .channel(`messages:${selectedProjectId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `project_id=eq.${selectedProjectId}`,
          },
          () => {
            fetchMessages(selectedProjectId);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedProjectId, supabase, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedProjectId || !currentUser) return;

    const content = newMsg;
    setNewMsg("");

    const res = await submitPortalMessageAction(selectedProjectId, content);

    if (!res.success) {
      alert(`Send error: ${res.error}`);
    } else {
      fetchMessages(selectedProjectId);
    }
  };

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-160px)]">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Messages</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Chat with the design and engineering team about your project details.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="flex-1 grid md:grid-cols-4 gap-6 min-h-0">
          {/* PROJECT SELECTOR COLUMN */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Project Threads
            </h2>
            <div className="flex flex-col gap-2">
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setLoading(true);
                    setSelectedProjectId(proj.id);
                  }}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition ${
                    selectedProjectId === proj.id ? "bg-primary text-primary-foreground border-transparent" : "bg-background hover:bg-muted"
                  }`}
                >
                  {proj.name}
                </button>
              ))}
            </div>
          </div>

          {/* CHAT BOARD COLUMN */}
          <Card className="md:col-span-3 border bg-background flex flex-col min-h-0">
            <CardHeader className="border-b py-3 px-4 flex-shrink-0">
              <CardTitle className="text-sm">
                Project Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 p-4 space-y-4 justify-between">
              {/* Messages timeline */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                {loading ? (
                  <div className="text-center py-12 text-sm text-muted-foreground">Loading chat feed...</div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const isOwn = msg.sender_id === currentUser?.id;
                    const senderProfile = msg.profiles;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                      >
                        <div className="flex gap-2 items-center text-[10px] text-muted-foreground mb-1">
                          <span className="font-bold">
                            {senderProfile?.full_name || "Anonymous"}
                          </span>
                          <span>&bull;</span>
                          <span className="capitalize">
                            {senderProfile?.role ? `(${senderProfile.role})` : ""}
                          </span>
                        </div>
                        <div className={`p-3 max-w-sm rounded-2xl text-sm leading-normal ${
                          isOwn ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-20 flex flex-col items-center justify-center space-y-2">
                    <MessageSquare size={24} className="text-muted-foreground/50" />
                    <span>No messages yet. Send a note to say hello!</span>
                  </div>
                )}
              </div>

              {/* Chat editor */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t flex-shrink-0">
                <Input
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-sm h-10"
                />
                <Button type="submit" size="icon" className="h-10 w-10 flex items-center justify-center">
                  <Send size={16} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-12 border rounded-xl bg-background text-center flex flex-col items-center justify-center space-y-3 max-w-lg mx-auto mt-12">
          <MessageSquare size={40} className="text-muted-foreground/50" />
          <h2 className="font-bold text-lg">No Chat Channels Available</h2>
          <p className="text-sm text-muted-foreground">
            You do not have any active project contracts. Once a project starts, a messaging thread will open here.
          </p>
        </div>
      )}
    </div>
  );
}
