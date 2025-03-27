export interface ResponseData {
  message: string;
  data?: any;
}

export interface AnalyzedImage {
  dataUrl: string;
  name: string;
  analysis?: {
    labels: {
      description: string;
    }[];
  };
  storyText?: string;
}

export interface Magazine {
  title: string;
  theme: string;
  style: string;
  analyzedImages: AnalyzedImage[];
  createdAt: Date;
}

export interface User {
  instagramId: string;
  imageUrls: string[];
  magazineTitle: string;
  analyzedImages: AnalyzedImage[];
  storyTheme: string;
  magazineStyle: string;
}
