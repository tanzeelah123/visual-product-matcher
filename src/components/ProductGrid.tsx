import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductMatch } from '../types';
import { Package, Filter } from 'lucide-react';

interface ProductGridProps {
  matches: ProductMatch[];
  isLoading: boolean;
  filters: {
    minScore: number;
    category: string;
    maxResults: number;
  };
  onFiltersChange: (filters: any) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  matches,
  isLoading,
  filters,
  onFiltersChange
}) => {
  const categories = Array.from(new Set(matches.map(m => m.product.category)));

  const filteredMatches = matches
    .filter(match => match.score >= filters.minScore)
    .filter(match => !filters.category || match.product.category === filters.category)
    .slice(0, filters.maxResults);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Finding similar products...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload an image to get started</h3>
        <p className="text-gray-600">
          We'll analyze your image and find visually similar products from our catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Similarity Score: {filters.minScore}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minScore}
              onChange={(e) => onFiltersChange({
                ...filters,
                minScore: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFiltersChange({
                ...filters,
                category: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Results
            </label>
            <select
              value={filters.maxResults}
              onChange={(e) => onFiltersChange({
                ...filters,
                maxResults: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={12}>12 products</option>
              <option value={24}>24 products</option>
              <option value={50}>50 products</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Similar Products ({filteredMatches.length})
        </h2>
        {filteredMatches.length > 0 && (
          <div className="text-sm text-gray-600">
            Best match: {filteredMatches[0]?.score.toFixed(1)}% similarity
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMatches.map((match) => (
            <ProductCard key={match.product.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or upload a different image.
          </p>
        </div>
      )}
    </div>
  );
};