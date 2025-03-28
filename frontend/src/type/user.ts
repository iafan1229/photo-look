export interface User {
  createdAt: string;
  imageUrls: string[];
  instagramId: string;
  title: string;
  theme: string;
  style: string;
  magazine: {
    title: string;
    theme: string;
    style: string;
    analyzedImages: {
      analysis: {
        labels: {
          description: string;
          _id: string;
        }[];
      };
      name: string;
      storyText: string;
      _id: string;
    }[];
  };
  updatedAt: string;
}
