'use client';

import React, { useState, useEffect } from 'react';
import { Review } from '@/core/interfaces/review.interface';
import { AISettings } from '@/core/interfaces/ai.interface';
import { AnswerSelector } from './AnswerSelector';

interface ReviewCardProps {
  review: Review;
  currentSettings: AISettings;
  onGenerate: (reviewId: string, settings: AISettings) => void;
  onPublish: (reviewId: string, replyText: string) => void;
  isGenerating: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  currentSettings,
  onGenerate,
  onPublish,
  isGenerating,
}) => {
  const [editableReply, setEditableReply] = useState(review.replyText || '');
  const [showAnswerSelector, setShowAnswerSelector] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (review.replyText) {
      setEditableReply(review.replyText);
    }
  }, [review.replyText]);

  const handleGenerateSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch('/api/reviews/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: review.id }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowAnswerSelector(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handlePublishFromSelector = (text: string) => {
    setEditableReply(text);
    onPublish(review.id, text);
    setShowAnswerSelector(false);
  };

  return (
    <>
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-900">{review.authorName}</h4>
            <div className="flex items-center text-amber-500 gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Status: <span className="font-medium">{review.status.replace('UNANSWERED', 'Unbeantwortet')}</span>
            </p>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString('de-DE')}
          </span>
        </div>

        {/* Rezensionstext */}
        <p className="text-gray-700 text-sm italic">"{review.comment}"</p>

        {/* Editor & Actions */}
        <div className="pt-2 border-t border-gray-100 space-y-3">
          {review.status === 'UNANSWERED' ? (
            <button
              onClick={handleGenerateSuggestions}
              disabled={loadingSuggestions}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              {loadingSuggestions ? 'Generiere 3 Vorschläge...' : '✨ 3 KI-Vorschläge generieren'}
            </button>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                KI-Antwortentwurf (bearbeitbar)
              </label>
              <textarea
                value={editableReply}
                onChange={(e) => setEditableReply(e.target.value)}
                rows={4}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onPublish(review.id, editableReply)}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  ✓ Auf Google veröffentlichen
                </button>
                <button
                  onClick={handleGenerateSuggestions}
                  disabled={loadingSuggestions}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition disabled:opacity-50"
                >
                  Neu generieren
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Answer Selector Modal */}
      {showAnswerSelector && (
        <AnswerSelector
          review={review}
          suggestions={suggestions}
          onPublish={handlePublishFromSelector}
          isLoading={isGenerating}
          onClose={() => setShowAnswerSelector(false)}
        />
      )}
    </>
  );
};