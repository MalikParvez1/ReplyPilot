'use client';

import React from 'react';
import { useReviews } from '../hooks/useReviews';
import { useSettingsStore } from '@/features/settings/store/useSettingsStore';
import { ReviewCard } from './ReviewCard';

export const ReviewDashboard: React.FC = () => {
  const { reviews, isLoading, generateReply, publishReply, isGenerating } = useReviews();
  const { settings, updateSettings } = useSettingsStore();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Rezensionen werden geladen...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LINKER TEIL: Dashboard-Einstellungen (Wie dein gewünschter Screenshot) */}
      <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">KI Einstellungen</h3>
          <p className="text-xs text-gray-500 mt-1">Passe an, wie die KI auf deine Kunden reagieren soll.</p>
        </div>

        {/* Tonalität */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Tonalität</label>
          <select
            value={settings.tone}
            onChange={(e) => updateSettings({ tone: e.target.value as any })}
            className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
          >
            <option value="friendly">Freundlich & Einladend</option>
            <option value="professional">Professionell & Sachlich</option>
            <option value="casual">Locker & Modern</option>
            <option value="empathetic">Empathisch (gut für Kritik)</option>
          </select>
        </div>

        {/* Länge */}
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

        {/* Firmen-Kontext */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Unternehmens-Kontext</label>
          <textarea
            value={settings.customContext}
            onChange={(e) => updateSettings({ customContext: e.target.value })}
            rows={4}
            placeholder="z.B. Besonderheiten, Parkplätze, Küchenstil..."
            className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm resize-none outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* RECHTER TEIL: Liste der unbeantworteten Rezensionen */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Unbeantwortete Rezensionen ({reviews.length})</h2>
          <p className="text-sm text-gray-500 mt-1">Generiere Antworten und bringe dein Google-Ranking nach vorn.</p>
        </div>

        {reviews.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500">
            🎉 Hervorragend! Alle Rezensionen wurden beantwortet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
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
  );
};