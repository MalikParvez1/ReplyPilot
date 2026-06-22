"use client";

import { useState } from "react";
import { ReviewCard } from "./ReviewCard";

type FilterType = "ALL" | "UNANSWERED" | "ANSWERED";

type Review = {
  id: string;
  reviewText: string;
  rating: number;
  reviewerName: string;
  replyText?: string | null;
};

export function ReviewDashboard({ initialReviews = [] }: { initialReviews: Review[] }) {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const filteredReviews = initialReviews.filter((review) => {
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
            {type === "UNANSWERED" && `Unbeantwortet (${initialReviews.filter(r => !r.replyText).length})`}
            {type === "ANSWERED" && "Beantwortet"}
          </button>
        ))}
      </div>

      {/* Grid Liste */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {filteredReviews.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-8">Keine Rezensionen in dieser Kategorie vorhanden.</p>
        )}
      </div>
    </div>
  );
}