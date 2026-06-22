"use client";

import { useState } from "react";
import { AnswerSelector } from "./AnswerSelector";
import { Button } from "@/components/ui/button";

interface ReviewCardProps {
  review: {
    id: string;
    reviewText: string;
    rating: number;
    reviewerName: string;
    replyText?: string | null;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentReply, setCurrentReply] = useState<string | null>(review.replyText || null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reviews/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText: review.reviewText, rating: review.rating }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (finalAnswer: string) => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/reviews/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review.id, replyText: finalAnswer }),
      });
      if (res.ok) {
        setCurrentReply(finalAnswer);
        setSuggestions([]); // Vorschläge nach Erfolg leeren
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-5 border rounded-xl shadow-sm bg-white dark:bg-slate-900 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{review.reviewerName}</h3>
          <div className="text-amber-400 text-xs mt-0.5">
            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          currentReply ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}>
          {currentReply ? "Beantwortet" : "Unbeantwortet"}
        </span>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 text-sm italic">
        &quot;{review.reviewText}&quot;
      </p>

      {currentReply ? (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-dashed text-xs">
          <span className="font-bold text-slate-400 block mb-1">Deine veröffentlichte Antwort:</span>
          <p className="text-slate-600 dark:text-slate-400">{currentReply}</p>
        </div>
      ) : (
        <>
          {suggestions.length === 0 && (
            <Button onClick={handleGenerate} disabled={isLoading} size="sm" className="w-full sm:w-auto">
              {isLoading ? "Generiere 3 Optionen..." : "KI-Optionen erstellen"}
            </Button>
          )}

          {suggestions.length > 0 && (
            <AnswerSelector
              suggestions={suggestions}
              onPublish={handlePublish}
              isPublishing={isPublishing}
            />
          )}
        </>
      )}
    </div>
  );
}