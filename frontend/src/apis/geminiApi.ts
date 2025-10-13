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
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `당신은 감성적이고 창의적인 포토 카드 텍스트를 작성하는 작가입니다.
                다음 이미지 라벨을 기반으로 ${theme} 테마에 맞는 포토 카드용 텍스트를 생성해 주세요.
                
                포토 카드 텍스트 작성 가이드:
                - 감성적이고 시적인 표현 사용
                - 한 눈에 들어오는 짧고 임팩트 있는 문구
                - 보는 사람의 마음에 울림을 주는 내용
                - SNS에서 공유하고 싶어지는 매력적인 표현
                
                전체 ${totalImages}장 중 ${imageIndex + 1}번째 포토 카드입니다.
                각 카드가 독립적이면서도 전체적으로 조화를 이루도록 작성해 주세요.
                
                한국어로 작성하며, 다음 형식으로 답변해 주세요:
                - 메인 텍스트: 10-15자 이내의 핵심 메시지 (photoTitle)
                - 서브 텍스트: 50-60자 이내의 감성적 설명 (photoContent)
                - 포토 카드 테마: ${theme}
                
                JSON 형식으로 photoTitle과 photoContent를 key로 하여 응답해 주세요.
                
                이미지 라벨: ${imageLabels.join(", ")}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 8192,
        },
      }
    );

    console.log(response);

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
