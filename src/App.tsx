import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { ProductGrid } from './components/ProductGrid';
import { TagsDisplay } from './components/TagsDisplay';
import { ImaggaService } from './services/imagga';
import { SimilarityCalculator } from './utils/similarity';
import { products } from './data/products';
import { UploadState, ProductMatch, ImaggaTag } from './types';
import { Search, Sparkles, AlertCircle } from 'lucide-react';

function App() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isAnalyzing: false,
    error: null,
    uploadedImage: null,
    extractedTags: []
  });

  const [matches, setMatches] = useState<ProductMatch[]>([]);
  const [filters, setFilters] = useState({
    minScore: 0,
    category: '',
    maxResults: 12
  });

  const handleImageUpload = async (imageInput: File | string) => {
    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      isAnalyzing: true,
      error: null
    }));

    try {
      let imageUrl: string;
      let tags: ImaggaTag[];

      if (typeof imageInput === 'string') {
        // URL input
        imageUrl = imageInput;
        tags = await ImaggaService.analyzeImageFromUrl(imageInput);
      } else {
        // File input
        imageUrl = URL.createObjectURL(imageInput);
        tags = await ImaggaService.analyzeImageFromFile(imageInput);
      }

      const similarProducts = SimilarityCalculator.findSimilarProducts(tags, products, 0);

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        isAnalyzing: false,
        uploadedImage: imageUrl,
        extractedTags: tags
      }));

      setMatches(similarProducts);
      
      // Reset filters when new image is uploaded
      setFilters({
        minScore: 0,
        category: '',
        maxResults: 12
      });

    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        isAnalyzing: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  };

  const handleClearImage = () => {
    if (uploadState.uploadedImage?.startsWith('blob:')) {
      URL.revokeObjectURL(uploadState.uploadedImage);
    }
    
    setUploadState({
      isUploading: false,
      isAnalyzing: false,
      error: null,
      uploadedImage: null,
      extractedTags: []
    });
    
    setMatches([]);
    setFilters({
      minScore: 0,
      category: '',
      maxResults: 12
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Visual Product Matcher</h1>
              <p className="text-gray-600">Find similar products using AI-powered image analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Tags */}
          <div className="lg:col-span-1 space-y-6">
            <ImageUpload
              onImageUpload={handleImageUpload}
              isUploading={uploadState.isUploading}
              uploadedImage={uploadState.uploadedImage}
              onClearImage={handleClearImage}
            />

            {uploadState.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 font-medium">Error</span>
                </div>
                <p className="text-red-600 mt-1">{uploadState.error}</p>
              </div>
            )}

            {uploadState.extractedTags.length > 0 && (
              <TagsDisplay tags={uploadState.extractedTags} />
            )}

            {/* Stats */}
            {matches.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Analysis Results</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tags detected:</span>
                    <span className="font-medium">{uploadState.extractedTags.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products found:</span>
                    <span className="font-medium">{matches.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best match:</span>
                    <span className="font-medium text-emerald-600">
                      {matches[0]?.score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Results */}
          <div className="lg:col-span-2">
            <ProductGrid
              matches={matches}
              isLoading={uploadState.isAnalyzing}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;