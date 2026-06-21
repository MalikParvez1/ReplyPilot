'use client';

import React, { useState } from 'react';
import { Review } from '@/core/interfaces/review.interface';

interface AnswerSelectorProps {
  review: Review;
  onPublish: (text: string) => void;
  isLoading?: boolean;
  suggestions?: string[];
  onClose?: () => void;
}

export const AnswerSelector: React.FC<AnswerSelectorProps> = ({
  review,
  onPublish,
  isLoading = false,
  suggestions = [],
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>('');
  const [step, setStep] = useState<'select' | 'edit'>('select');

  const handleSelectSuggestion = (index: number) => {
    setSelectedIndex(index);
    setEditedText(suggestions[index]);
    setStep('edit');
  };

  const handlePublish = () => {
    onPublish(editedText);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold opacity-90 uppercase tracking-widest">
                {step === 'select' ? 'Antwortvorschläge' : 'Antwort bearbeiten'}
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {review.authorName || 'Anonymer Nutzer'}
              </h2>
              <p className="mt-1 text-blue-100 text-sm">
                {review.rating} ★ • {new Date(review.createdAt).toLocaleDateString('de-DE')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Original Review anzeigen */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Originale Rezension</p>
            <p className="mt-3 text-gray-900 leading-relaxed">{review.comment}</p>
          </div>

          {step === 'select' ? (
            // Suggestions List
            <div className="space-y-3">
              {suggestions.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  <p className="font-medium">Lädt Vorschläge...</p>
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(index)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition ${
                      selectedIndex === index
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                        {index + 1}
                      </div>
                      <p className="text-gray-900 text-sm leading-relaxed">{suggestion}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            // Editor
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Deine Antwort bearbeiten
                </label>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={6}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  placeholder="Bearbeite deinen Antworttext..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition"
                >
                  Zurück
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-xl font-medium transition"
                >
                  {isLoading ? 'Veröffentliche...' : 'Auf Google veröffentlichen'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
