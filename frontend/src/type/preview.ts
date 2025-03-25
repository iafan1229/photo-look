// src/types.ts
export type ThemeType =
  | "auto"
  | "travel"
  | "family"
  | "food"
  | "nature"
  | "city"
  | "event";
export type StyleType = "modern" | "classic" | "minimalist" | "vibrant";

export interface ImageData {
  file: File;
  dataUrl: string;
  name: string;
}

export interface Label {
  description: string;
  score: number;
}

export interface Face {
  joy: boolean;
}

export interface ImageAnalysis {
  labels: Label[];
  mainTheme: string;
  emotion: string;
  dominantColors: string[];
  landmark: string | null;
  text: string;
  faces: Face[];
}

export interface AnalyzedImage {
  dataUrl: string;
  name: string;
  analysis: ImageAnalysis;
}

export interface MagazinePreviewProps {
  title: string;
  images: AnalyzedImage[];
  theme: ThemeType;
  style: StyleType;
}

export interface ImagePreviewProps {
  images: ImageData[];
}
