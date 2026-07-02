import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        const role = profile?.role || "client";
        const normalizedRole = role.toLowerCase().replace(/_/g, "-");
        
        if (normalizedRole === "admin" || normalizedRole === "super-admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        } else {
          return NextResponse.redirect(new URL("/portal", request.url));
        }
      }
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/auth/login?error=auth-callback-failed", request.url));
}
