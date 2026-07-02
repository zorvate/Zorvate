"use client";

import { useState } from "react";
import { CalendarDays, Clock, HelpCircle, Video, CheckCircle2 } from "lucide-react";
import { bookPortalMeetingAction } from "@/lib/backend/actions/portal-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";

export default function BookMeetingPage() {
  const [meetingType, setMeetingType] = useState<"discovery" | "sprint_sync" | "design_review" | "architecture_review">("sprint_sync");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBookMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateTime) return;

    setLoading(true);
    const res = await bookPortalMeetingAction({
      meetingType,
      dateTime,
      description,
    });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setDateTime("");
      setDescription("");
    } else {
      alert(`Booking error: ${res.error}`);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl text-foreground select-none">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Book a Meeting</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Coordinate progress sprints, review UX designs, and sync with engineering leads.
        </p>
      </div>

      {success ? (
        <GlassCard tilt={false} className="p-8 border bg-card/25 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20">
            <CheckCircle2 size={32} className="animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Meeting Request Submitted!</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed font-semibold">
              Our project success managers have been notified. We have added a confirmation alert to your workspace notifications timeline and will email slot details shortly.
            </p>
          </div>
          <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-xl font-bold h-10 px-6">
            Book Another Meeting
          </Button>
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Booking options selector */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Sync Objectives</h2>
            
            <div className="space-y-3">
              {[
                { id: "sprint_sync", title: "Sprint Progression Sync", duration: "30 Mins", desc: "Weekly check on active sprint items.", icon: Clock },
                { id: "design_review", title: "Design Wireframe Review", duration: "45 Mins", desc: "Walk through UX boards and prototypes.", icon: Video },
                { id: "architecture_review", title: "Technical Review Call", duration: "60 Mins", desc: "Align server integrations and RLS parameters.", icon: HelpCircle },
                { id: "discovery", title: "Discovery Consultation", duration: "30 Mins", desc: "Evaluate new feature roadmap proposals.", icon: CalendarDays },
              ].map((type) => {
                const Icon = type.icon;
                const isSelected = meetingType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setMeetingType(type.id as "discovery" | "sprint_sync" | "design_review" | "architecture_review")}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-xs flex gap-3 items-start select-none ${
                      isSelected 
                        ? "bg-primary/10 border-primary text-foreground shadow-sm shadow-primary/5" 
                        : "bg-card/35 hover:bg-muted/40 border-border/40 text-muted-foreground"
                    }`}
                  >
                    <Icon size={16} className={`flex-shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <div className="font-bold text-foreground flex justify-between items-center">
                        <span>{type.title}</span>
                        <span className="text-[9px] uppercase tracking-widest text-primary/70 font-black">{type.duration}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-normal font-semibold">
                        {type.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <Card className="border bg-card/25 backdrop-blur-md rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Schedule Reservation Slot</CardTitle>
                <CardDescription className="text-xs">
                  Pick a convenient calendar date and target timing coordinates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookMeeting} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <Label htmlFor="slot_dt">Date & Target Time</Label>
                    <Input
                      id="slot_dt"
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      required
                      className="bg-background/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="meeting_desc">Discussion Targets (Optional)</Label>
                    <Textarea
                      id="meeting_desc"
                      placeholder="List any design parameters or queries you want to cover..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="bg-background/40"
                    />
                  </div>

                  <Button type="submit" disabled={loading || !dateTime} className="w-full font-bold h-10 rounded-xl">
                    {loading ? "Scheduling Sync..." : "Schedule Sync Meeting"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
