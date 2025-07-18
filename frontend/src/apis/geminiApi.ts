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

  // API 코드에서 사용
  const generatePhotoCardText = (
    theme: string,
    totalImages: number,
    imageIndex: number,
    imageLabels: string[]
  ) => {
    const promptTemplate = process.env.NEXT_PUBLIC_PROMPT;

    const text = promptTemplate
      ?.replace("{theme}", theme)
      .replace("{totalImages}", totalImages.toString())
      .replace("{imageIndex}", imageIndex.toString())
      .replace("{imageLabels}", imageLabels.join(", "));

    return text;
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${generatePhotoCardText(
                  theme,
                  totalImages,
                  imageIndex,
                  imageLabels
                )}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 200,
        },
      }
    );

    // Gemini 응답 구조에서 텍스트 추출
    if (response?.data?.candidates?.[0]?.content?.parts?.[0]) {
      return response.data.candidates[0].content.parts[0].text;
    }

    return "포토 카드 텍스트를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Google Gemini API 호출 중 오류:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Google Gemini API 오류 (${error.response.status}): ${JSON.stringify(
          error.response.data
        )}`
      );
    }
    throw new Error("포토 카드 텍스트 생성 중 오류가 발생했습니다.");
  }
};
