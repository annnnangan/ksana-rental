import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "@/lib/next-auth-config/routes";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Retrieve the user's session using next-auth/jwt
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some((route) => new RegExp(`^${route.replace("*", ".*")}$`).test(nextUrl.pathname));
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Everyone should be able to login/register
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from login/register pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users away from private routes
  if (!isLoggedIn && !isPublicRoute) {
    // Store the current URL in the query parameter `redirectTo`
    const redirectUrl = new URL("/auth/login", nextUrl.origin);
    redirectUrl.searchParams.set("redirect", nextUrl.pathname + nextUrl.search);

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Configure middleware paths
export const config = {
  matcher: [
    // Skip internal paths and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
