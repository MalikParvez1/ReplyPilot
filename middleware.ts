import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Definiere hier alle Routen, die zwingend einen Login erfordern
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)' // Schützt das Dashboard und alle Unterseiten (z.B. /dashboard/markenstimme)
]);

export default clerkMiddleware((auth, req) => {
  // 2. Wenn der Nutzer eine geschützte Route aufruft, blockiere den Zugriff ohne Login
  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    // Überspringt interne Next.js-Dateien und statische Assets (Bilder, CSS)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Führt die Middleware immer für API-Routen aus
    '/(api|trpc)(.*)',
  ],
};