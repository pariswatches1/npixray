/**
 * Auth middleware — protects /dashboard/* routes.
 * Redirects unauthenticated users to /login.
 */

export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*"],
};
