import { ImaggaResponse, ImaggaTag } from '../types';

const IMAGGA_API_KEY = import.meta.env.VITE_IMAGGA_API_KEY;
const IMAGGA_API_SECRET = import.meta.env.VITE_IMAGGA_API_SECRET;

if (!IMAGGA_API_KEY || !IMAGGA_API_SECRET) {
  console.error('Imagga API credentials are missing');
}

export class ImaggaService {
  private static getAuthHeader(): string {
    const credentials = btoa(`${IMAGGA_API_KEY}:${IMAGGA_API_SECRET}`);
    return `Basic ${credentials}`;
  }

  static async analyzeImageFromFile(file: File): Promise<ImaggaTag[]> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://api.imagga.com/v2/tags', {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ImaggaResponse = await response.json();
      
      if (data.status.type === 'error') {
        throw new Error(data.status.text);
      }

      return data.result.tags;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  static async analyzeImageFromUrl(imageUrl: string): Promise<ImaggaTag[]> {
    try {
      const response = await fetch(`https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ImaggaResponse = await response.json();
      
      if (data.status.type === 'error') {
        throw new Error(data.status.text);
      }

      return data.result.tags;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }
}