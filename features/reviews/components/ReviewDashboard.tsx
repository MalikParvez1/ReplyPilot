"use client";

import { useState } from "react";
import { ReviewCard } from "./ReviewCard";
import { useReviews } from "../hooks/useReviews";
import { Loader2, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import { KPIDashboard } from "./KPIDashboard";

type FilterType = "ALL" | "UNANSWERED" | "ANSWERED";

interface ReviewDashboardProps {
  hasAnalyticsAccess: boolean;
}

export function ReviewDashboard({ hasAnalyticsAccess }: ReviewDashboardProps) {
  const { reviews, isLoading } = useReviews();
  const [filter, setFilter] = useState<FilterType>("ALL");
  
  // NEU: State für das Ein- und Ausklappen des KPI Dashboards
  const [isKPIExpanded, setIsKPIExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === "UNANSWERED") return !review.replyText;
    if (filter === "ANSWERED") return !!review.replyText;
    return true; 
  });

  return (
    <div className="space-y-8">
      
      {/* --- EINKLAPPBARER BEREICH FÜR DAS KPI DASHBOARD --- */}
      <div className="space-y-4">
        {/* Toggle Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsKPIExpanded(!isKPIExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
          >
            <BarChart2 className="w-4 h-4" />
            {isKPIExpanded ? "Statistiken ausblenden" : "Statistiken einblenden"}
            {isKPIExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Dashboard (wird nur gerendert, wenn isKPIExpanded true ist) */}
        {isKPIExpanded && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-300">
            <KPIDashboard 
              reviews={reviews} 
              hasAnalyticsAccess={hasAnalyticsAccess} 
            />
          </div>
        )}
      </div>
      {/* --------------------------------------------------- */}

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
    </div>
  );
}