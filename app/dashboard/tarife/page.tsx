"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

// Hier trägst du später deine echten Preis-IDs aus dem Stripe-Dashboard ein!
// (Format: price_1OaXyz...)
const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_ID,
  pro: process.env.STRIPE_PRO_ID,
  business: process.env.STRIPE_BUSINESS_ID
};






export default function TarifePage() {
    const { userId } = useAuth();
    const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  
    const handleSubscribe = async (priceId: string) => {
      // Sicherheitsabfrage: Wenn der Nutzer nicht eingeloggt ist, breche ab
      if (!userId) {
        console.error("Nur eingeloggte Nutzer können einen Tarif wählen.");
        return;
      }
  
      try {
        setLoadingPriceId(priceId);
      
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      
      // Leite den Nutzer auf die von Stripe generierte URL weiter
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
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="mb-10">
        <p className="text-sm text-slate-500 font-medium mb-1">Abonnement verwalten</p>
        <h1 className="text-3xl font-bold text-slate-900">Tarife & Abrechnung</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Starter Plan */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col h-full">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
          <div className="flex items-baseline space-x-1 mb-6">
            <span className="text-4xl font-extrabold text-slate-900">19 €</span>
            <span className="text-slate-500 font-medium">/ Monat</span>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            {["1 Standort", "50 Bewertungen / Monat", "1 Markenstimme-Vorlage", "Push-Benachrichtigungen", "E-Mail-Support (48h)"].map((f, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-slate-600 text-sm">{f}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => handleSubscribe(STRIPE_PRICE_IDS.starter)}
            disabled={loadingPriceId !== null}
            className="w-full py-3.5 rounded-xl font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-900 flex justify-center items-center"
          >
            {loadingPriceId === STRIPE_PRICE_IDS.starter ? <Loader2 className="w-5 h-5 animate-spin" /> : "Starter wählen"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="p-8 rounded-3xl bg-white border-2 border-[#FF5A36] shadow-xl relative transform md:-translate-y-4 flex flex-col h-full">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="bg-[#FF5A36] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              Empfohlen
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
          <div className="flex items-baseline space-x-1 mb-6">
            <span className="text-4xl font-extrabold text-slate-900">29 €</span>
            <span className="text-slate-500 font-medium">/ Monat</span>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            {["3 Standorte", "200 Bewertungen / Monat", "5 Markenstimme-Vorlagen", "Auto-Antwort (nur positiv)", "Volles Analytics-Dashboard", "E-Mail-Support (24h)"].map((f, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF5A36] shrink-0" />
                <span className="text-slate-900 font-medium text-sm">{f}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => handleSubscribe(STRIPE_PRICE_IDS.pro)}
            disabled={loadingPriceId !== null}
            className="w-full py-3.5 rounded-xl font-bold transition-all bg-[#FF5A36] hover:bg-[#e04a29] text-white shadow-md flex justify-center items-center"
          >
            {loadingPriceId === STRIPE_PRICE_IDS.pro ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pro wählen"}
          </button>
        </div>

        {/* Business Plan */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col h-full">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Business</h3>
          <div className="flex items-baseline space-x-1 mb-6">
            <span className="text-4xl font-extrabold text-slate-900">79 €</span>
            <span className="text-slate-500 font-medium">/ Monat</span>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            {["10 Standorte", "Unbegrenzte Bewertungen", "Unbegrenzte Vorlagen", "Auto-Antwort (alle)", "Analytics inkl. Export", "Telefon-Support (4h)"].map((f, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-slate-600 text-sm">{f}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => handleSubscribe(STRIPE_PRICE_IDS.business)}
            disabled={loadingPriceId !== null}
            className="w-full py-3.5 rounded-xl font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-900 flex justify-center items-center"
          >
            {loadingPriceId === STRIPE_PRICE_IDS.business ? <Loader2 className="w-5 h-5 animate-spin" /> : "Business wählen"}
          </button>
        </div>

      </div>
    </div>
  );
}