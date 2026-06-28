'use client';

import React from 'react';
import { Review } from '@/core/interfaces/review.interface';

interface KPIDashboardProps {
  reviews: Review[];
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({ reviews }) => {
  const totalReviews = reviews.length;
  const unansweredReviews = reviews.filter((review) => review.status === 'UNANSWERED').length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : '–';

  const activityFeed = [...reviews]
    .filter((review) => review.status === 'UNANSWERED')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-[0.2em]">KPI Übersicht</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Schneller Überblick</h2>
          <p className="mt-1 text-sm text-gray-500">Die wichtigsten Metriken und die neuesten Aufgaben auf einen Blick.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-blue-600 p-5 text-white shadow-sm"> 
          <p className="text-sm uppercase tracking-[0.2em] text-blue-100">Durchschnittliche Bewertung</p>
          <p className="mt-4 text-4xl font-semibold">{averageRating}</p>
        </div>
        <div className="rounded-3xl bg-gray-100 p-5 text-gray-900 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Unbeantwortete Rezensionen</p>
          <p className="mt-4 text-4xl font-semibold">{unansweredReviews}</p>
        </div>
        <div className="rounded-3xl bg-gray-100 p-5 text-gray-900 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Gesamtanzahl Rezensionen</p>
          <p className="mt-4 text-4xl font-semibold">{totalReviews}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Aktivitäts-Feed</h3>
          <p className="text-sm text-gray-500">Neueste Reviews, die Aufmerksamkeit benötigen</p>
        </div>

        {activityFeed.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
            Keine neuen Bewertungen, die sofort bearbeitet werden müssen.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {activityFeed.map((review) => (
              <div key={review.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.authorName || 'Anonymer Nutzer'}</p>
                    <p className="mt-1 text-sm text-gray-600">{review.comment.slice(0, 80)}{review.comment.length > 80 ? '…' : ''}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">{review.rating} ★</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Status: {review.status.replace('UNANSWERED', 'Unbeantwortet')}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
