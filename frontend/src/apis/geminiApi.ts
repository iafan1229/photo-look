// src/apis/geminiApi.ts
import axios from "axios";

interface GenerateContentRequest {
  imageLabels: string[];
  theme: string;
  imageIndex: number;
  totalImages: number;
}

export const generateGeminiApi = async ({
  imageLabels,
  theme,
  imageIndex,
  totalImages,
}: GenerateContentRequest): Promise<string> => {
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error("Google Gemini API 키가 설정되지 않았습니다.");
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `당신은 사진을 보고 매거진 기사를 작성하는 작가입니다. 
                다음 이미지 라벨을 기반으로 자연스러운 ${theme} 테마의 짧은 매거진 텍스트를 생성해 주세요. 
                전체 ${totalImages}장 중 ${imageIndex + 1}번째 이미지입니다. 
                스토리가 자연스럽게 흘러가도록 만들어 주세요. 한국어로 작성해 주세요.
                100-150자 정도로 간결하게 작성해 주세요.
                
                이미지 라벨: ${imageLabels.join(", ")}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250,
        },
      }
    );

    // Gemini 응답 구조에서 텍스트 추출
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0]
    ) {
      return response.data.candidates[0].content.parts[0].text;
    }

    return "이미지에 대한 이야기를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Google Gemini API 호출 중 오류:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Google Gemini API 오류 (${error.response.status}): ${JSON.stringify(
          error.response.data
        )}`
      );
    }
    throw new Error("텍스트 생성 중 오류가 발생했습니다.");
  }
};
