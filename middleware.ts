import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { getEffectiveRole } from "@/lib/auth/role";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const path = request.nextUrl.pathname;

  const isAuthRoute = path.startsWith("/auth");
  const isAdminRoute = path.startsWith("/admin");
  const isPortalRoute = path.startsWith("/portal");
  const isProtectedRoute = isAuthRoute || isAdminRoute || isPortalRoute;

  // Immediately return response for public marketing routes to avoid unnecessary Supabase network calls
  if (!isProtectedRoute) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },

      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Parameters<typeof response.cookies.set>[2];
        }[]
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const startTime = Date.now();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole = "client";
  if (user) {
    userRole = getEffectiveRole(null, user.email);
    if (userRole !== "super-admin") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      userRole = getEffectiveRole(profile?.role, user.email);
    }
  }

  const duration = Date.now() - startTime;
  console.log(`[Middleware] Auth check for ${path} (${duration}ms) - Role: ${userRole}`);

  if (!user && (isAdminRoute || isPortalRoute)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user && isAuthRoute) {
    const dest = userRole === "admin" || userRole === "super-admin" ? "/admin" : "/portal";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (user && isAdminRoute && userRole !== "admin" && userRole !== "super-admin") {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
