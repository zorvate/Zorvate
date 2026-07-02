import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isAuthRoute = path.startsWith("/auth");
  const isAdminRoute = path.startsWith("/admin");
  const isPortalRoute = path.startsWith("/portal");

  let userRole = "client";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role) {
      userRole = profile.role.toLowerCase().replace(/_/g, "-");
    }
    const devAdminEmail = process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL || process.env.DEV_ADMIN_EMAIL;
    if (user.email && devAdminEmail && user.email.toLowerCase() === devAdminEmail.toLowerCase()) {
      userRole = "super-admin";
    }
  }

  if (!user && (isAdminRoute || isPortalRoute)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user && isAuthRoute) {
    const dest = (userRole === "admin" || userRole === "super-admin") ? "/admin" : "/portal";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (user && isAdminRoute && userRole !== "admin" && userRole !== "super-admin") {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
