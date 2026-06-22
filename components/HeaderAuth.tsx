// components/HeaderAuth.tsx
"use client"; // WICHTIG: Macht dies zu einer Client Component

import Link from "next/link";
import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function HeaderAuth() {
  // Hier dürfen wir useAuth() problemlos nutzen, da wir im Client sind!
  const { isLoaded, userId } = useAuth();

  // Verhindert ein "Flackern" der Buttons, solange Clerk den Status lädt
  if (!isLoaded) {
    return <div className="w-20 h-8 animate-pulse bg-slate-200 rounded-full"></div>;
  }

  // Wenn der Nutzer EINGELOGGT ist
  if (userId) {
    return (
      <>
        <Link href="/dashboard" className="px-5 py-2.5 bg-[#111827] text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all">
          Zum Dashboard
        </Link>
        <UserButton />
      </>
    );
  }

  // Wenn der Nutzer AUSGELOGGT ist
  return (
    <>
      <SignInButton mode="modal">
        <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          Login
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="hidden sm:block px-5 py-2.5 bg-[#111827] text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all">
          Kostenlos starten
        </button>
      </SignUpButton>
    </>
  );
}