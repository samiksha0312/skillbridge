import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/role",
]);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    auth.protect();   // ✅ IMPORTANT: use auth()
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};