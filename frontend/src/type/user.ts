// types/index.ts

// 이미지 분석 결과 라벨 인터페이스
interface AnalysisLabel {
  description: string;
}

// 분석된 이미지 인터페이스
interface AnalyzedImage {
  name: string;
  analysis: {
    labels: AnalysisLabel[];
  };
  storyText: string;
}

// 매거진 정보 인터페이스
interface Magazine {
  title: string;
  theme: string;
  style: string;
  analyzedImages: AnalyzedImage[];
  createdAt: string;
}

// 사용자 개인 정보 인터페이스
interface PersonalInfo {
  name: string;
  email: string;
  phoneNumber: string;
  snsId: string;
}

// admin 사용자 데이터 인터페이스
interface UserData {
  personalInfo: PersonalInfo;
  imageUrls: string[];
  magazine: Magazine;
  status: string;
}

export type { AnalysisLabel, AnalyzedImage, Magazine, PersonalInfo, UserData };
