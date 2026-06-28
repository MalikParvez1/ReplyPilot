'use client';

import React from 'react';

export interface FilterOptions {
  status: 'ALL' | 'UNANSWERED' | 'GENERATED' | 'ANSWERED';
  rating: number | 'ALL';
  sortBy: 'newest' | 'oldest' | 'lowest-rating' | 'highest-rating';
}

interface ReviewFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  totalCount: number;
  filteredCount: number;
}

export const ReviewFilter: React.FC<ReviewFilterProps> = ({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
}) => {
  const handleStatusChange = (status: FilterOptions['status']) => {
    onFilterChange({ ...filters, status });
  };

  const handleRatingChange = (rating: number | 'ALL') => {
    onFilterChange({ ...filters, rating });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Filter & Sortierung</h3>
          <p className="text-xs text-gray-500 mt-1">
            {filteredCount} von {totalCount} Rezensionen
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value as FilterOptions['status'])}
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">Alle Rezensionen</option>
            <option value="UNANSWERED">Unbeantwortet</option>
            <option value="GENERATED">Generiert</option>
            <option value="ANSWERED">Beantwortet</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Bewertung</label>
          <select
            value={filters.rating === 'ALL' ? 'ALL' : filters.rating}
            onChange={(e) =>
              handleRatingChange(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))
            }
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">Alle Bewertungen</option>
            <option value="5">5 Sterne</option>
            <option value="4">4 Sterne</option>
            <option value="3">3 Sterne</option>
            <option value="2">2 Sterne</option>
            <option value="1">1 Stern</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Sortieren nach</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-600"
          >
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
            <option value="highest-rating">Höchste Bewertung</option>
            <option value="lowest-rating">Niedrigste Bewertung</option>
          </select>
        </div>
      </div>
    </div>
  );
};
