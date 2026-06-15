// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Welche Routen sollen geschützt sein?
const isProtectedRoute = createRouteMatcher([
  '/',             // Dashboard
  '/admin(.*)',    // Admin-Bereich
  '/api/reviews(.*)' // Unsere API Routen
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect(); // Leitet User zum Login, wenn nicht eingeloggt
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};