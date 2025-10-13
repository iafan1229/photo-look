// server/src/types/index.ts

export interface RequestData {
  name?: string;
  sns?: string;
  title?: string;
}

export interface PaginationInfo {
  currentPage: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ResponseData {
  message: string;
  data?: any;
  status?: string;
  query?: string;
  total?: number;
  pagination?: PaginationInfo;
}

export interface AnalyzedImage {
  // dataUrl: string;
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

export interface PersonalInfo {
  name: string;
  email: string;
  phoneNumber: string;
  snsId?: string;
}

export interface User extends PersonalInfo {
  status?: string;
  rejectionReason?: string;
  imageUrls: string[];
  magazineTitle: string;
  analyzedImages: AnalyzedImage[];
  storyTheme: string;
  magazineStyle: string;
}
