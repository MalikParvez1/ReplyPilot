"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AnswerSelectorProps {
  suggestions: string[];
  onPublish: (finalAnswer: string) => void;
  isPublishing: boolean;
}

export function AnswerSelector({ suggestions, onPublish, isPublishing }: AnswerSelectorProps) {
  const [selectedText, setSelectedText] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleSelectOption = (text: string, index: number) => {
    setActiveIndex(index);
    setSelectedText(text); // Lädt den Text direkt in den Editor
  };

  return (
    <div className="space-y-4 mt-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Wähle einen KI-Vorschlag aus:
      </h4>
      
      {/* 3 Spalten für die 3 KI-Optionen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectOption(suggestion, idx)}
            className={`p-3 text-sm border rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
              activeIndex === idx
                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500"
                : "border-slate-200 bg-white hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700"
            }`}
          >
            <div>
              <span className="inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mb-2">
                Option {idx + 1}
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-5">
                {suggestion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Texteditor wird nur angezeigt, wenn eine Option gewählt wurde */}
      {activeIndex !== null && (
        <div className="space-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
          <label className="text-xs font-medium text-slate-500 block">
            Antwort anpassen & personalisieren:
          </label>
          <Textarea
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
            rows={4}
            className="w-full text-sm p-3 bg-white dark:bg-slate-800 border-slate-200"
            placeholder="Hier kannst du den Text umschreiben..."
          />
          <div className="flex justify-end">
            <Button
              onClick={() => onPublish(selectedText)}
              disabled={isPublishing || !selectedText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPublishing ? "Wird gesendet..." : "Auf Google antworten"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}