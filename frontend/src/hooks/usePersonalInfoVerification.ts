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
      // 1️⃣ S3 업로드
      const uploadRes = await axios.post("/api/admin/upload", {
        images: analyzedImages,
      });

      if (uploadRes.data.status !== "success") {
        api.error({
          message: "이미지 업로드 실패",
          description: uploadRes.data.message || "이미지 업로드 중 오류 발생",
        });
        return false;
      }

      const uploadedImageUrls = uploadRes.data.data;

      // 2️⃣ DB 저장
      const userRes = await axios.post("/api/admin/user", {
        personalInfo,
        magazineInfo: {
          title: magazineTitle,
          theme: storyTheme,
          style: magazineStyle,
          analyzedImages,
        },
        imageUrls: uploadedImageUrls,
      });

      if (userRes.data.status !== "success") {
        api.error({
          message: "DB 저장 실패",
          description: userRes.data.message || "사용자 정보 저장 중 오류 발생",
        });
        return false;
      }

      const newUser = userRes.data.data;
      const userId = newUser._id;

      // 3️⃣ 이메일 발송
      const notifyRes = await axios.post("/api/admin/notify", {
        userId,
        uploadedImageUrls,
      });

      if (notifyRes.data.status !== "success") {
        api.error({
          message: "이메일 발송 실패",
          description: notifyRes.data.message || "관리자 알림 이메일 발송 실패",
        });
        return false;
      }

      // ✅ 모든 단계 성공
      api.success({
        message: "인증 요청 성공",
        description:
          "등록 요청이 관리자에게 전송되었습니다. 승인 후 이미지가 등록됩니다.",
      });

      return true;
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
