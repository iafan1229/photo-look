// frontend/src/hooks/usePersonalInfoVerification.ts
import { useState } from "react";
import axios from "axios";
import { notification } from "antd";
import { geminiAnalyzedImage, ThemeType, StyleType } from "@/type/preview";
import { PersonalInfo } from "@/components/verification/PersonalInfoVerification";

interface UsePersonalInfoVerificationProps {
  images: geminiAnalyzedImage[];
  personalInfo: PersonalInfo;
  magazineTitle: string;
  analyzedImages: geminiAnalyzedImage[];
  storyTheme: ThemeType;
  magazineStyle: StyleType;
}

export const usePersonalInfoVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleVerificationSuccess = async ({
    images,
    personalInfo,
    magazineTitle,
    analyzedImages,
    storyTheme,
    magazineStyle,
  }: UsePersonalInfoVerificationProps) => {
    setIsLoading(true);
    try {
      // 백엔드 API로 모든 정보 전송 (이미지와 개인정보)
      const response = await axios.post("/api/upload-to-s3-and-notify", {
        images: analyzedImages,
        personalInfo,
        magazineTitle,
        storyTheme,
        magazineStyle,
      });

      if (response.data.status === "success") {
        api.success({
          message: "인증 요청 성공",
          description:
            "등록 요청이 관리자에게 전송되었습니다. 승인 후 이미지가 등록됩니다.",
        });
        return true;
      } else {
        api.error({
          message: "인증 요청 실패",
          description:
            response.data.message || "알 수 없는 오류가 발생했습니다.",
        });
        return false;
      }
    } catch (error: any) {
      console.error("인증 요청 처리 중 에러 발생:", error);
      api.error({
        message: "서버 오류",
        description:
          error.response?.data?.message ||
          "서버와의 통신 중 오류가 발생했습니다.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleVerificationSuccess,
    isLoading,
    contextHolder,
  };
};
