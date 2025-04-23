export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/studio/*",
  "/studio/*/*",
  "/api/studio/*/reviews",
  "/explore-studios",
  "/api/studios/*",
  "/api/copilotkit",
];

export const authRoutes = ["/auth/login", "/auth/register"];

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
