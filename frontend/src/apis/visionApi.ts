// Google Cloud Vision API 키 (환경 변수에서 가져와야 함)
// 실제 구현 시에는 환경 변수로 관리해야 합니다

import { ImageAnalysis } from "@/type/preview";

// const API_KEY = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
const API_URL = "https://vision.googleapis.com/v1/images:annotate";

interface VisionAPIResponse {
  labelAnnotations?: Array<{
    description: string;
    score: number;
  }>;
  faceAnnotations?: Array<{
    joyLikelihood: string;
    [key: string]: any;
  }>;
  landmarkAnnotations?: Array<{
    description: string;
    score: number;
    [key: string]: any;
  }>;
  fullTextAnnotation?: {
    text: string;
    [key: string]: any;
  };
  imagePropertiesAnnotation?: {
    dominantColors: {
      colors: Array<{
        color: {
          red: number;
          green: number;
          blue: number;
        };
        score: number;
        pixelFraction: number;
      }>;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export const analyzeImage = async (
  imageData: string
): Promise<ImageAnalysis> => {
  try {
    // API 키가 없는 경우 에러 처리
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY) {
      throw new Error("Google Cloud API 키가 설정되지 않았습니다.");
    }

    // base64 이미지 데이터에서 헤더 제거
    const base64Image = imageData.split(",")[1];

    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            { type: "LABEL_DETECTION", maxResults: 10 },
            { type: "FACE_DETECTION", maxResults: 5 },
            { type: "LANDMARK_DETECTION", maxResults: 5 },
            { type: "TEXT_DETECTION", maxResults: 5 },
            { type: "IMAGE_PROPERTIES", maxResults: 5 },
          ],
        },
      ],
    };

    // 실제 API 호출은 주석 처리
    // const response = await axios.post(`${API_URL}?key=${API_KEY}`, requestBody);
    // return processApiResponse(response.data.responses[0]);

    // 테스트용 더미 데이터 반환
    return {
      labels: [
        { description: "풍경", score: 0.95 },
        { description: "자연", score: 0.87 },
      ],
      mainTheme: "자연",
      emotion: "평온",
      dominantColors: ["#3498db", "#2ecc71"],
      landmark: null,
      text: "",
      faces: [],
    };
  } catch (error) {
    console.error("Vision API 호출 중 오류:", error);
    throw new Error("이미지 분석 중 오류가 발생했습니다.");
  }
};

const processApiResponse = (apiResponse: VisionAPIResponse): ImageAnalysis => {
  // 라벨 분석
  const labels = apiResponse.labelAnnotations || [];

  // 감정 추정 (얼굴 표정 기반)
  const faces = apiResponse.faceAnnotations || [];
  const faceJoy = faces.map((face) => {
    return {
      joy:
        face.joyLikelihood === "VERY_LIKELY" || face.joyLikelihood === "LIKELY",
    };
  });

  // 감정 추론 (단순화된 버전)
  let emotion = "중립";
  if (faceJoy.some((face) => face.joy)) {
    emotion = "기쁨";
  }

  // 랜드마크 감지
  const landmarks = apiResponse.landmarkAnnotations || [];
  const landmark = landmarks.length > 0 ? landmarks[0].description : null;

  // 텍스트 추출
  const text = apiResponse.fullTextAnnotation
    ? apiResponse.fullTextAnnotation.text
    : "";

  // 주요 색상 추출
  const dominantColors = extractDominantColors(
    apiResponse.imagePropertiesAnnotation
  );

  // 주요 테마 분석 (실제 구현에서는 더 복잡한 알고리즘 필요)
  let mainTheme = "일반";
  const themes = [
    {
      name: "자연",
      keywords: ["자연", "풍경", "산", "바다", "호수", "꽃", "나무"],
    },
    { name: "도시", keywords: ["도시", "건물", "거리", "건축", "스카이라인"] },
    {
      name: "음식",
      keywords: ["음식", "요리", "식사", "레스토랑", "과일", "디저트"],
    },
    { name: "여행", keywords: ["여행", "관광", "휴가", "모험", "탐험"] },
    { name: "가족", keywords: ["가족", "사람", "그룹", "아이", "부모"] },
    { name: "이벤트", keywords: ["이벤트", "축제", "파티", "축하", "기념"] },
  ];

  // 라벨 기반으로 테마 추정
  for (const theme of themes) {
    for (const label of labels) {
      if (theme.keywords.includes(label.description.toLowerCase())) {
        mainTheme = theme.name;
        break;
      }
    }
    if (mainTheme !== "일반") break;
  }

  return {
    labels,
    mainTheme,
    emotion,
    dominantColors,
    landmark,
    text,
    faces: faceJoy,
  };
};

const extractDominantColors = (
  imageProperties?: VisionAPIResponse["imagePropertiesAnnotation"]
): string[] => {
  if (
    !imageProperties ||
    !imageProperties.dominantColors ||
    !imageProperties.dominantColors.colors
  ) {
    return ["#cccccc", "#eeeeee"]; // 기본 색상
  }

  return imageProperties.dominantColors.colors
    .slice(0, 3) // 상위 3개만 추출
    .map((color) => {
      const { red, green, blue } = color.color;
      return `rgb(${red}, ${green}, ${blue})`;
    });
};
