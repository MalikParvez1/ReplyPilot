"use client";

import Link from "next/link";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function HeroCTA() {
  const { isLoaded, userId } = useAuth();

  // Verhindert Flackern während des Ladens
  if (!isLoaded) return <div className="w-48 h-14 animate-pulse bg-slate-200 rounded-full"></div>;

  // Wenn der Nutzer BEREITS EINGELOGGT ist: Link zum Dashboard
  if (userId) {
    return (
      <Link href="/dashboard" className="px-8 py-4 bg-[#FF5A36] hover:bg-[#e04a29] text-white text-lg font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all flex items-center space-x-2">
        <span>Zum Dashboard</span>
        <ArrowRight className="w-5 h-5" />
      </Link>
    );
  }

  // Wenn der Nutzer AUSGELOGGT ist: Öffne das PopUp-Modal
  return (
    <SignUpButton mode="modal">
      <button className="px-8 py-4 bg-[#FF5A36] hover:bg-[#e04a29] text-white text-lg font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all flex items-center space-x-2">
        <span>Kostenlos starten</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </SignUpButton>
  );
}

export function BottomCTA() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return <div className="w-64 h-14 animate-pulse bg-slate-800 rounded-full mx-auto relative z-10"></div>;

  if (userId) {
    return (
      <Link href="/dashboard" className="inline-flex px-8 py-4 bg-[#FF5A36] hover:bg-[#e04a29] text-white text-lg font-bold rounded-full shadow-lg transition-all relative z-10">
        Zum Dashboard
      </Link>
    );
  }

  return (
    <SignUpButton mode="modal">
      <button className="inline-flex px-8 py-4 bg-[#FF5A36] hover:bg-[#e04a29] text-white text-lg font-bold rounded-full shadow-lg transition-all relative z-10">
        Jetzt Cockpit einrichten
      </button>
    </SignUpButton>
  );
}