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

export function PricingCTA({ highlighted }: { highlighted?: boolean }) {
  const { isLoaded, userId } = useAuth();

  const baseClass = "w-full py-3.5 rounded-xl font-bold transition-all flex justify-center items-center text-sm";
  const highlightedClass = highlighted
    ? "bg-[#FF5A36] hover:bg-[#e04a29] text-white shadow-md shadow-orange-500/20"
    : "bg-slate-100 hover:bg-slate-200 text-slate-900";

  // Verhindert Flackern während Clerk lädt
  if (!isLoaded) {
    return <div className={`h-12 animate-pulse rounded-xl w-full ${highlighted ? 'bg-orange-200' : 'bg-slate-200'}`}></div>;
  }

  // Wenn eingeloggt -> Direkt zum Tarif-Upgrade ins Dashboard
  if (userId) {
    return (
      <Link href="/dashboard/tarife" className={`${baseClass} ${highlightedClass}`}>
        Tarif auswählen
      </Link>
    );
  }

  // Wenn ausgeloggt -> Öffne das Registrierungs-Modal
  return (
    <SignUpButton mode="modal">
      <button className={`${baseClass} ${highlightedClass}`}>
        Kostenlos testen
      </button>
    </SignUpButton>
  );
}