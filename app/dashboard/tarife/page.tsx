"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, Star } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const STRIPE_PRICE_IDS = {
  free: process.env.NEXT_PUBLIC_STRIPE_FREE_ID,
  starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_ID,
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_ID,
  business: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_ID,
};

export default function TarifePage() {
  const { userId } = useAuth();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // MOCK: Hier würdest du später aus deiner Datenbank abfragen, welchen Tarif der Nutzer hat.
  // Zum Testen kannst du hier z.B. STRIPE_PRICE_IDS.starter eintragen, um zu sehen wie es aussieht!
  const currentPlanId: string | null = null; 

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleSubscribe = async (priceId?: string, trialPeriodDays?: number) => {
    if (!userId) {
      console.error("Nur eingeloggte Nutzer können einen Tarif wählen.");
      return;
    }

    if (!priceId) {
      console.error("Keine Stripe-Preis-ID konfiguriert.");
      return;
    }

    try {
      setLoadingPriceId(priceId);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, trialPeriodDays }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Fehler beim Weiterleiten zu Stripe", error);
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300 pb-20">
      <div className="mb-12 text-center md:text-left">
        <p className="text-sm text-[#FF5A36] font-bold tracking-wider uppercase mb-2">Abonnement verwalten</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Tarife & Abrechnung</h1>
        <p className="text-slate-500 mt-2 max-w-2xl">Wähle den Plan, der am besten zu deinem Unternehmen passt. Jederzeit kündbar oder anpassbar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch mt-8">
        
        {/* --- GRATIS TEST PLAN --- */}
        <div className={`relative p-8 rounded-3xl flex flex-col h-full transition-all duration-300 
          ${currentPlanId === STRIPE_PRICE_IDS.free 
            ? "bg-emerald-50/50 border-2 border-emerald-500 shadow-md ring-4 ring-emerald-500/10" 
            : "bg-gradient-to-b from-emerald-50/80 to-white border border-emerald-200 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1"}`}>
          
          <div className="mb-4 inline-flex self-start rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            30 Tage Trial
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
          <div className="flex items-baseline space-x-1 mb-4">
            <span className="text-4xl font-extrabold text-slate-900">0 €</span>
            <span className="text-slate-500 font-medium">/ 1 Monat</span>
          </div>
          <p className="text-sm text-emerald-700/80 mb-6 leading-relaxed">Teste das Starter-Abo 30 Tage lang komplett kostenlos, bevor du zahlst.</p>
          
          <div className="space-y-4 mb-8 flex-1">
            {["1 Standort", "50 Bewertungen / Monat", "1 Markenstimme-Vorlage", "Push-Benachrichtigungen", "E-Mail-Support (48h)"].map((f, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscribe(STRIPE_PRICE_IDS.starter, 30)}
            disabled={!isMounted || loadingPriceId !== null || !STRIPE_PRICE_IDS.starter || currentPlanId === STRIPE_PRICE_IDS.free}
            className={`w-full py-3.5 rounded-xl font-bold transition-all flex justify-center items-center
              ${currentPlanId === STRIPE_PRICE_IDS.free 
                ? "bg-emerald-100 text-emerald-600 cursor-not-allowed" 
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"}`}
          >
            {loadingPriceId === STRIPE_PRICE_IDS.starter ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             currentPlanId === STRIPE_PRICE_IDS.free ? "Aktueller Tarif" : "Kostenlos testen"}
          </button>
        </div>

        {/* --- STARTER PLAN --- */}
        <div className={`relative p-8 rounded-3xl flex flex-col h-full transition-all duration-300
          ${currentPlanId === STRIPE_PRICE_IDS.starter 
            ? "bg-slate-50 border-2 border-slate-900 shadow-md ring-4 ring-slate-900/5" 
            : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1"}`}>
          
          {currentPlanId === STRIPE_PRICE_IDS.starter && (
            <div className="absolute -top-3 -right-3 bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4" />
            </div>
          )}

          <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">Starter</h3>
          <div className="flex items-baseline space-x-1 mb-6">
            <span className="text-4xl font-extrabold text-slate-900">19 €</span>
            <span className="text-slate-500 font-medium">/ Monat</span>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            {["1 Standort", "50 Bewertungen / Monat", "1 Markenstimme-Vorlage", "Push-Benachrichtigungen", "E-Mail-Support (48h)"].map((f, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscribe(STRIPE_PRICE_IDS.starter)}
            disabled={!isMounted || loadingPriceId !== null || !STRIPE_PRICE_IDS.starter || currentPlanId === STRIPE_PRICE_IDS.starter}
            className={`w-full py-3.5 rounded-xl font-bold transition-all flex justify-center items-center
              ${currentPlanId === STRIPE_PRICE_IDS.starter 
                ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"}`}
          >
            {loadingPriceId === STRIPE_PRICE_IDS.starter ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             currentPlanId === STRIPE_PRICE_IDS.starter ? "Aktueller Tarif" : "Starter wählen"}
          </button>
        </div>

        {/* --- PRO PLAN (EMPFOHLEN) --- */}
        <div className={`relative p-8 rounded-3xl flex flex-col h-full transition-all duration-300 md:-translate-y-4
          ${currentPlanId === STRIPE_PRICE_IDS.pro 
            ? "bg-orange-50/30 border-2 border-[#FF5A36] shadow-lg shadow-orange-500/10 ring-4 ring-[#FF5A36]/10" 
            : "bg-white border-2 border-[#FF5A36] shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-6"}`}>
          
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-[#FF5A36] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Empfohlen</span>
          </div>

          {currentPlanId === STRIPE_PRICE_IDS.pro && (
            <div className="absolute -top-3 -right-3 bg-[#FF5A36] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4" />
            </div>
          )}

          <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">Pro</h3>
          <div className="flex items-baseline space-x-1 mb-6">
            <span className="text-4xl font-extrabold text-slate-900">29 €</span>
            <span className="text-slate-500 font-medium">/ Monat</span>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            {["3 Standorte", "200 Bewertungen / Monat", "5 Markenstimme-Vorlagen", "Auto-Antwort (nur positiv)", "Volles Analytics-Dashboard", "E-Mail-Support (24h)"].map((f, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-[#FF5A36] shrink-0 mt-0.5" />
                <span className="text-slate-900 font-medium text-sm">{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscribe(STRIPE_PRICE_IDS.pro)}
            disabled={!isMounted || loadingPriceId !== null || !STRIPE_PRICE_IDS.pro || currentPlanId === STRIPE_PRICE_IDS.pro}
            className={`w-full py-3.5 rounded-xl font-bold transition-all flex justify-center items-center
              ${currentPlanId === STRIPE_PRICE_IDS.pro 
                ? "bg-orange-100 text-orange-600 cursor-not-allowed" 
                : "bg-[#FF5A36] hover:bg-[#e04a29] text-white shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"}`}
          >
            {loadingPriceId === STRIPE_PRICE_IDS.pro ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             currentPlanId === STRIPE_PRICE_IDS.pro ? "Aktueller Tarif" : "Pro wählen"}
          </button>
        </div>

        {/* --- BUSINESS PLAN --- */}
        <div className={`relative p-8 rounded-3xl flex flex-col h-full transition-all duration-300
          ${currentPlanId === STRIPE_PRICE_IDS.business 
            ? "bg-slate-50 border-2 border-slate-900 shadow-md ring-4 ring-slate-900/5" 
            : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1"}`}>
          
          {currentPlanId === STRIPE_PRICE_IDS.business && (
            <div className="absolute -top-3 -right-3 bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4" />
            </div>
          )}

          <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">Business</h3>
          <div className="flex items-baseline space-x-1 mb-6">
            <span className="text-4xl font-extrabold text-slate-900">79 €</span>
            <span className="text-slate-500 font-medium">/ Monat</span>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            {["10 Standorte", "Unbegrenzte Bewertungen", "Unbegrenzte Vorlagen", "Auto-Antwort (alle)", "Analytics inkl. Export", "Telefon-Support (4h)"].map((f, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscribe(STRIPE_PRICE_IDS.business)}
            disabled={!isMounted || loadingPriceId !== null || !STRIPE_PRICE_IDS.business || currentPlanId === STRIPE_PRICE_IDS.business}
            className={`w-full py-3.5 rounded-xl font-bold transition-all flex justify-center items-center
              ${currentPlanId === STRIPE_PRICE_IDS.business 
                ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"}`}
          >
            {loadingPriceId === STRIPE_PRICE_IDS.business ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             currentPlanId === STRIPE_PRICE_IDS.business ? "Aktueller Tarif" : "Business wählen"}
          </button>
        </div>

      </div>
    </div>
  );
}