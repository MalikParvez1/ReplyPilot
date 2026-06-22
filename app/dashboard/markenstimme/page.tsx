"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function MarkenstimmePage() {
  const [tonality, setTonality] = useState("Warm");
  const [emojiEnabled, setEmojiEnabled] = useState(true);

  return (
    <div className="max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">So klingt deine Marke</p>
          <h1 className="text-3xl font-bold text-slate-900">Markenstimme</h1>
        </div>
        <Button className="bg-[#FF5A36] hover:bg-[#e04a29] text-white rounded-full px-6">
          Antworten
        </Button>
      </div>

      <div className="space-y-8">
        {/* Firmenname & Unterzeichner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">Firmenname</Label>
            <Input defaultValue="Trattoria Bella" className="bg-white border-slate-200 shadow-sm rounded-xl h-11" />
            <p className="text-[11px] text-slate-400">Erscheint in der Signatur.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">Unterzeichner</Label>
            <Input defaultValue="Maria & Team" className="bg-white border-slate-200 shadow-sm rounded-xl h-11" />
          </div>
        </div>

        {/* Tonalität */}
        <div className="space-y-3">
          <Label className="text-slate-700 font-semibold">Tonalitaet</Label>
          <div className="flex space-x-3">
            {["Warm", "Professionell", "Locker"].map((t) => (
              <button
                key={t}
                onClick={() => setTonality(t)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all border ${
                  tonality === t
                    ? "border-[#FF5A36] bg-orange-50 text-[#FF5A36]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sprache & Emojis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">Sprache</Label>
            <select className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950">
              <option>Automatisch erkennen</option>
              <option>Deutsch</option>
              <option>Englisch</option>
            </select>
          </div>
          <div className="space-y-2 pt-1">
            <Label className="text-slate-700 font-semibold mb-3 block">Emoji erlauben</Label>
            <div className="flex items-center space-x-3">
              <Switch 
                checked={emojiEnabled} 
                onCheckedChange={setEmojiEnabled}
                className="data-[state=checked]:bg-teal-500"
              />
              <span className="text-sm text-slate-500">Sparsam, nur bei positiven Antworten</span>
            </div>
          </div>
        </div>

        {/* Marken-Floskel */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Marken-Floskel (optional)</Label>
          <Input defaultValue="Buon appetito und bis bald!" className="bg-white border-slate-200 shadow-sm rounded-xl h-11" />
          <p className="text-[11px] text-slate-400">Wird ans Ende jeder Antwort angehängt.</p>
        </div>

        {/* Verbotene Wörter (Einfacher Mockup für Tags) */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Verbotene Woerter</Label>
          <div className="min-h-[44px] flex items-center flex-wrap gap-2 p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md flex items-center">
              billig <button className="ml-2 text-slate-400 hover:text-red-500">&times;</button>
            </span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md flex items-center">
              Beschwerde <button className="ml-2 text-slate-400 hover:text-red-500">&times;</button>
            </span>
            <input type="text" placeholder="Wort + Enter" className="text-sm outline-none bg-transparent flex-1 ml-2 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-400">Diese Woerter erscheinen nie in einer Antwort (z.B. aus Compliance-Gruenden).</p>
        </div>

        {/* Live-Vorschau */}
        <div className="space-y-2 pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-900">Live-Vorschau</h3>
            <span className="text-xs text-slate-400">Beispiel: 2-Sterne-Bewertung</span>
          </div>
          <div className="bg-[#0F172A] text-slate-300 p-6 rounded-2xl shadow-lg">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4 block">
              SO ANTWORTET REPLYPILOT
            </span>
            <p className="text-sm leading-relaxed">
              Guten Tag Sandra, vielen Dank fuer Ihre offene Rueckmeldung, und es tut uns leid, dass wir Sie enttaeuscht haben. 
              Gerade beim Thema Essen sollte es bei uns anders laufen, das schauen wir uns umgehend an. Wir moechten das unbedingt 
              geradebiegen, denn so kennen Sie uns sonst nicht. Melden Sie sich gerne direkt bei uns, dann finden wir gemeinsam eine Loesung. 
              <br/><br/>
              Buon appetito und bis bald! Herzliche Gruesse, <br/>
              Maria & Team, Trattoria Bella
            </p>
          </div>
        </div>

        {/* Speichern Button */}
        <div className="pt-6 pb-20">
          <Button className="bg-[#FF5A36] hover:bg-[#e04a29] text-white rounded-full px-8 h-12 text-sm font-bold shadow-lg shadow-orange-500/20">
            Markenstimme speichern
          </Button>
        </div>
      </div>
    </div>
  );
}