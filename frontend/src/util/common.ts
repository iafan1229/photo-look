interface AIResponse {
  aiCommonTheme?: string;
  aiTitle?: string;
  aiContent?: string;
}

export function extractTitleAndContent(jsonResponse: string | undefined): {
  theme: string;
  title: string;
  content: string;
} {
  try {
    if (jsonResponse === undefined) {
      return { theme: "", title: "", content: "" };
    }

    // 마크다운 코드 블록에서 JSON 부분만 추출
    const jsonRegex = /```json\s*({[\s\S]*?})\s*```/;
    const match = jsonResponse.match(jsonRegex);

    if (!match || !match[1]) {
      console.error("JSON 데이터를 찾을 수 없습니다.");
      return { theme: "", title: "", content: "" };
    }

    // 추출된 JSON 문자열 파싱
    const jsonData = JSON.parse(match[1]);

    return {
      theme: jsonData?.aiCommonTheme || "",
      title: jsonData?.aiTitle || "",
      content: jsonData?.aiContent || "",
    };
  } catch (error) {
    console.error("JSON 파싱 중 오류 발생:", error);
    // 에러 발생 시에도 기본값 반환
    return { theme: "", title: "", content: "" };
  }
}
