import { useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";
import { notification } from "antd";
import { geminiAnalyzedImage } from "@/type/preview";
import { ThemeType } from "@/type/preview";
import { StyleType } from "@/type/preview";

interface UseInstagramVerificationProps {
  images: {
    dataUrl: string;
    name: string;
  }[];
  instagramId: string;
  magazineTitle: string;
  analyzedImages: geminiAnalyzedImage[];
  storyTheme: ThemeType;
  magazineStyle: StyleType;
}

interface RegisterUserData {
  instagramId: string;
  imageUrls: string[];
  magazineTitle: string;
  analyzedImages: geminiAnalyzedImage[];
  storyTheme: ThemeType;
  magazineStyle: StyleType;
}

export const useInstagramVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const uploadToS3 = async (images: { dataUrl: string; name: string }[]) => {
    AWS.config.update({
      region: "ap-northeast-2",
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    try {
      // dataUrl을 File 객체로 변환
      const files = await Promise.all(
        images.map(async (image) => {
          const response = await fetch(image.dataUrl);
          const blob = await response.blob();
          return new File([blob], image.name, { type: blob.type });
        })
      );

      // S3에 업로드
      const uploadPromises = files.map((file) => {
        const uid =
          Date.now().toString() + Math.random().toString(36).substr(2);
        return new AWS.S3.ManagedUpload({
          params: {
            Bucket: "photolookbucket",
            Key: `img-upload/${uid}-${file.name}`,
            Body: file,
            ContentType: file.type,
          },
        }).promise();
      });

      const results = await Promise.all(uploadPromises);
      api.success({ message: "이미지를 서버에 저장했습니다." });
      return results.map((result) => result.Location);
    } catch (error) {
      api.error({ message: "이미지 업로드 실패" });
      throw error;
    }
  };

  const registerUser = async (data: RegisterUserData) => {
    try {
      const response = await axios.post("/api/auth/register", {
        instagramId: data.instagramId,
        imageUrls: data.imageUrls,
        magazineTitle: data.magazineTitle,
        analyzedImages: data.analyzedImages.map((el) => ({
          name: el.name,
          analysis: el.analysis,
          storyText: el.storyText,
        })),
        storyTheme: data.storyTheme,
        magazineStyle: data.magazineStyle,
      });

      api.success({ message: "사용자 등록 완료" });
      return response.data;
    } catch (error: any) {
      api.error({
        message: error.response?.data || error.message || "사용자 등록 실패",
      });
      throw error;
    }
  };

  const handleVerificationSuccess = async ({
    images,
    instagramId,
    magazineTitle,
    analyzedImages,
    storyTheme,
    magazineStyle,
  }: UseInstagramVerificationProps) => {
    setIsLoading(true);
    try {
      // 1. S3에 이미지 업로드
      const imageUrls = await uploadToS3(images);

      // 2. 사용자 등록
      await registerUser({
        instagramId,
        imageUrls,
        magazineTitle,
        analyzedImages,
        storyTheme,
        magazineStyle,
      });

      return true;
    } catch (error) {
      console.error("처리 중 에러 발생:", error);
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
