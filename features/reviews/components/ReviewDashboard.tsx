"use client";

import { useState } from "react";
import { ReviewCard } from "./ReviewCard";
import { useReviews } from "../hooks/useReviews";
import { Loader2 } from "lucide-react";

type FilterType = "ALL" | "UNANSWERED" | "ANSWERED";

export function ReviewDashboard() {
  // 1. Echte Daten über deinen Hook aus der DB laden!
  const { reviews, isLoading } = useReviews();
  const [filter, setFilter] = useState<FilterType>("ALL");

  // 2. Lade-Animation anzeigen, solange die DB antwortet
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // 3. Filter-Logik auf die geladenen Daten anwenden
  const filteredReviews = reviews.filter((review) => {
    if (filter === "UNANSWERED") return !review.replyText;
    if (filter === "ANSWERED") return !!review.replyText;
    return true; // "ALL"
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {(["ALL", "UNANSWERED", "ANSWERED"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              filter === type
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {type === "ALL" && "Alle Rezensionen"}
            {type === "UNANSWERED" && `Unbeantwortet (${reviews.filter(r => !r.replyText).length})`}
            {type === "ANSWERED" && `Beantwortet (${reviews.filter(r => r.replyText).length})`}
          </button>
        ))}
      </div>

      {/* Grid Liste */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {filteredReviews.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-8">
            Keine Rezensionen in dieser Kategorie vorhanden.
          </p>
        )}
      </div>
    </div>
  );
}