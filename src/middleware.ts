import { auth } from "~/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Log cookie info for debugging
  const sessionToken = request.cookies.get("next-auth.session-token");
  console.log("[MIDDLEWARE] Request to", pathname, "with sessionToken:", !!sessionToken?.value);

  // Get session
  const session = await auth();
  console.log("[MIDDLEWARE] Session result:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    email: session?.user?.email,
  });

  // If user is admin and on home page, redirect to admin panel
  if (pathname === "/" && session?.user) {
    // Check if user is admin by querying database
    // We can't trust session.user.isAdmin, so we'll let the frontend handle it
    // Instead, just log for debugging
    console.log("[MIDDLEWARE] User logged in:", { email: session.user.email });
  }

  // Proteggi le route admin
  if (pathname.startsWith("/admin")) {
    // Se non loggato, redirige al login
    if (!session?.user) {
      console.log("[MIDDLEWARE] Unauthenticated access to /admin, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Log per debug
    console.log("[MIDDLEWARE] Admin route access attempt:", {
      email: session.user.email,
      sessionHasIsAdmin: session.user.isAdmin !== undefined,
      isAdmin: session.user.isAdmin,
    });
  }

  // Permetti l'accesso a login e register solo se non loggato
  if (pathname === "/login" || pathname === "/register") {
    if (session?.user) {
      console.log(
        "[MIDDLEWARE] Authenticated user trying to access",
        pathname,
        ", redirecting to /"
      );
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/login", "/register"],
};
