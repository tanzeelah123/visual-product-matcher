import React from 'react';
import { Star, Tag } from 'lucide-react';
import { ProductMatch } from '../types';

interface ProductCardProps {
  match: ProductMatch;
}

export const ProductCard: React.FC<ProductCardProps> = ({ match }) => {
  const { product, score, matchingTags } = match;

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
            {score.toFixed(1)}% match
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <span className="text-lg font-bold text-gray-800 ml-auto">
            ${product.price}
          </span>
        </div>
        
        {matchingTags.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <Tag className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-xs text-gray-500 font-medium">Matching Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {matchingTags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {matchingTags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{matchingTags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      </div>
    </div>
  );
};