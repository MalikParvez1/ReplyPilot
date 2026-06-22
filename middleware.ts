import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)'
]);

// 1. KORREKTUR: Die Funktion muss 'async' sein
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 2. KORREKTUR: 'await' und 'auth()' mit Klammern
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};