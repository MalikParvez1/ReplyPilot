'use client';

import React, { useState, useMemo } from 'react';
import { useReviews } from '../hooks/useReviews';
import { useSettingsStore } from '@/features/settings/store/useSettingsStore';
import { ReviewCard } from './ReviewCard';
import { KPIDashboard } from './KPIDashboard';
import { ReviewFilter, FilterOptions } from './ReviewFilter';

export const ReviewDashboard: React.FC = () => {
  const { reviews, isLoading, generateReply, publishReply, isGenerating } = useReviews();
  const { settings, updateSettings } = useSettingsStore();
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'UNANSWERED',
    rating: 'ALL',
    sortBy: 'newest',
  });

  // Filterte und sortierte Reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Status Filter
    if (filters.status !== 'ALL') {
      result = result.filter((r) => r.status === filters.status);
    }

    // Rating Filter
    if (filters.rating !== 'ALL') {
      result = result.filter((r) => r.rating === filters.rating);
    }

    // Sortierung
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters.sortBy === 'highest-rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'lowest-rating') {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [reviews, filters]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Rezensionen werden geladen...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <KPIDashboard reviews={reviews} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LINKE SEITENLEISTE: Einstellungen */}
        <div className="lg:col-span-1 space-y-6 h-fit">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">KI Einstellungen</h3>
              <p className="text-xs text-gray-500 mt-1">Personalisiere die KI-Antworten für dein Unternehmen.</p>
            </div>

            {/* Tonalität */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Tonalität</label>
              <select
                value={settings.tone}
                onChange={(e) => updateSettings({ tone: e.target.value as any })}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-600"
              >
                <option value="friendly">Freundlich & Einladend</option>
                <option value="professional">Professionell & Sachlich</option>
                <option value="casual">Locker & Modern</option>
                <option value="empathetic">Empathisch (gut für Kritik)</option>
              </select>
            </div>

            {/* Antwortlänge */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Antwortlänge</label>
              <div className="flex gap-2">
                {(['short', 'medium', 'long'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => updateSettings({ length: l })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition ${
                      settings.length === l
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {l === 'short' ? 'Kurz' : l === 'medium' ? 'Mittel' : 'Lang'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sprache */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Antwort-Sprache</label>
              <select
                value={settings.language || 'de'}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-600"
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>

            {/* Unternehmens-Kontext */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Unternehmens-Kontext</label>
              <textarea
                value={settings.customContext || ''}
                onChange={(e) => updateSettings({ customContext: e.target.value })}
                rows={3}
                placeholder="z.B. Besonderheiten, Öffnungszeiten, besondere Services..."
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm resize-none outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Standard-Antwortsatz */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Standard-Informationen</label>
              <textarea
                value={settings.standardReplyText || ''}
                onChange={(e) => updateSettings({ standardReplyText: e.target.value })}
                rows={2}
                placeholder="z.B. Kontaktinformationen, öffnungszeiten..."
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm resize-none outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* RECHTE SEITENLEISTE: Review-Liste */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter */}
          <ReviewFilter
            filters={filters}
            onFilterChange={setFilters}
            totalCount={reviews.length}
            filteredCount={filteredReviews.length}
          />

          {/* Reviews */}
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-3xl text-gray-500">
              <p className="text-lg font-medium">
                {filters.status === 'ALL' && filters.rating === 'ALL'
                  ? '🎉 Keine Rezensionen vorhanden'
                  : '✨ Keine Rezensionen entsprechen den Filterkriterien'}
              </p>
              <p className="text-sm mt-2">Versuche die Filter anzupassen.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentSettings={settings}
                  onGenerate={(id, set) => generateReply({ reviewId: id, settings: set })}
                  onPublish={(id, text) => publishReply({ reviewId: id, replyText: text })}
                  isGenerating={isGenerating}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};