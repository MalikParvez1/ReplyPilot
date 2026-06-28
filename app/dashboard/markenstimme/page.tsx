"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

// Vorgenerierte Tonalitäten für die Buttons
const TONE_PRESETS = [
  "Professionell & Höflich (Sie)",
  "Locker & Freundlich (Du)",
  "Herzlich & Emotional (Du)",
  "Sachlich & Kurz (Sie)",
  "Hip & Modern (Du)"
];

export default function MarkenstimmePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    toneOfVoice: "Professionell & Höflich (Sie)",
    closingWord: "",
    forbiddenWords: "",
    additionalContext: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            businessName: data.businessName || "",
            businessType: data.businessType || "",
            toneOfVoice: data.toneOfVoice || "Professionell & Höflich (Sie)",
            closingWord: data.closingWord || "",
            forbiddenWords: data.forbiddenWords || "",
            additionalContext: data.additionalContext || "",
          });
        }
        setIsLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) setMessage("✅ Markenstimme erfolgreich gespeichert!");
      else setMessage("❌ Fehler beim Speichern.");
    } catch (error) {
      setMessage("❌ Ein Fehler ist aufgetreten.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin w-6 h-6 text-slate-400" /></div>;

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Markenstimme & KI-Regeln</h1>
        <p className="text-slate-500 mt-2">
          Passe an, wie die KI für dein Unternehmen antworten soll. Wähle eine Tonalität und setze klare Grenzen.
        </p>
      </div>

      <div className="space-y-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Basisdaten */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Name des Unternehmens</Label>
            <Input 
              id="businessName" 
              placeholder="z.B. Café am Park" 
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Branche</Label>
            <Input 
              id="businessType" 
              placeholder="z.B. Gastronomie" 
              value={form.businessType}
              onChange={(e) => setForm({ ...form, businessType: e.target.value })}
            />
          </div>
        </div>

        {/* Tonalität mit Buttons */}
        <div className="space-y-3">
          <Label>Tonalität (Wie sprichst du Kunden an?)</Label>
          <div className="flex flex-wrap gap-2">
            {TONE_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant={form.toneOfVoice === preset ? "default" : "outline"}
                onClick={() => setForm({ ...form, toneOfVoice: preset })}
                className="text-xs"
              >
                {preset}
              </Button>
            ))}
          </div>
          <Input 
            placeholder="Oder eigene Tonalität eingeben..." 
            value={form.toneOfVoice}
            onChange={(e) => setForm({ ...form, toneOfVoice: e.target.value })}
            className="mt-2 text-sm"
          />
        </div>

        {/* Leitplanken (Guardrails) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="closingWord" className="text-blue-600">Fester Schlusssatz (Optional)</Label>
            <Input 
              id="closingWord" 
              placeholder="z.B. Liebe Grüße, dein Café am Park Team" 
              value={form.closingWord}
              onChange={(e) => setForm({ ...form, closingWord: e.target.value })}
            />
            <p className="text-[11px] text-slate-400">Die KI beendet jede Antwort genau hiermit.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="forbiddenWords" className="text-red-500">Verbotene Wörter (Optional)</Label>
            <Input 
              id="forbiddenWords" 
              placeholder="z.B. Entschuldigung, leider, hoffen" 
              value={form.forbiddenWords}
              onChange={(e) => setForm({ ...form, forbiddenWords: e.target.value })}
            />
            <p className="text-[11px] text-slate-400">Trenne Wörter mit Kommas.</p>
          </div>
        </div>

        {/* Zusatzregeln */}
        <div className="space-y-2">
          <Label htmlFor="additionalContext">Sonstige KI-Anweisungen</Label>
          <Textarea 
            id="additionalContext" 
            placeholder="z.B. Nutze maximal ein Emoji pro Antwort. Bedanke dich immer für Kritik." 
            className="h-24"
            value={form.additionalContext}
            onChange={(e) => setForm({ ...form, additionalContext: e.target.value })}
          />
        </div>

        <div className="pt-4 flex items-center gap-4 border-t border-slate-100">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Einstellungen speichern
          </Button>
          {message && <span className="text-sm font-medium text-slate-600">{message}</span>}
        </div>

      </div>
    </div>
  );
}