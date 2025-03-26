// src/apis/textGenerationApi.ts
import { generateGeminiApi } from "./geminiApi";
import { AIModelType } from "@/components/settings/ModelSettings";

interface GenerateContentRequest {
  imageLabels: string[];
  theme: string;
  imageIndex: number;
  totalImages: number;
  model: AIModelType;
}

export const generateStoryContent = async ({
  imageLabels,
  theme,
  imageIndex,
  totalImages,
  model,
}: GenerateContentRequest): Promise<string> => {
  const request = {
    imageLabels,
    theme,
    imageIndex,
    totalImages,
  };

  try {
    switch (model) {
      case "gemini":
        return await generateGeminiApi(request);

      default:
        throw new Error("지원되지 않는 AI 모델입니다.");
    }
  } catch (error) {
    console.error(`${model} 모델을 사용한 텍스트 생성 중 오류:`, error);

    // 첫 번째 모델이 실패한 경우 백업 모델 시도
    if (model !== "gemini") {
      try {
        console.log("백업 모델(Gemini)로 시도합니다...");
        return await generateGeminiApi(request);
      } catch (backupError) {
        console.error("백업 모델도 실패했습니다:", backupError);
      }
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("텍스트 생성 중 오류가 발생했습니다.");
  }
};
