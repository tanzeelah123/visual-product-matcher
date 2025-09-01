export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  imageUrl: string;
  description: string;
  tags: string[];
  brand: string;
  rating: number;
  reviews: number;
}

export interface ImaggaTag {
  tag: string;
  confidence: number;
}

export interface ImaggaResponse {
  result: {
    tags: ImaggaTag[];
  };
  status: {
    text: string;
    type: string;
  };
}

export interface ProductMatch {
  product: Product;
  score: number;
  matchingTags: string[];
}

export interface UploadState {
  isUploading: boolean;
  isAnalyzing: boolean;
  error: string | null;
  uploadedImage: string | null;
  extractedTags: ImaggaTag[];
}