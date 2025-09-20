import { Request, Response } from "express";
import { ResponseData } from "../types";
import { userRepository } from "../repositories/userRepository";
import { emailService } from "../services/adminServices";

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// S3 클라이언트 초기화
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// -------------------- API 1️⃣ S3 업로드 --------------------
const uploadImages = async (req: Request, res: Response<ResponseData>) => {
  try {
    const { images } = req.body;
    if (!images || !images.length) {
      return res.status(400).json({ status: "error", message: "이미지 없음" });
    }

    const uploadedImageUrls: string[] = [];
    for (const image of images) {
      const imageId = uuidv4();
      const base64Data = image.dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fileExtension = image.dataUrl.split(";")[0].split("/")[1];
      const fileName = `${imageId}.${fileExtension}`;

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || "photo-look-bucket",
        Key: `magazine-images/${fileName}`,
        Body: buffer,
        ContentType: `image/${fileExtension}`,
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      const imageUrl = `https://${uploadParams.Bucket}.s3.${
        process.env.AWS_REGION || "ap-northeast-2"
      }.amazonaws.com/${uploadParams.Key}`;
      uploadedImageUrls.push(imageUrl);
    }

    return res.status(200).json({
      status: "success",
      data: uploadedImageUrls,
      message: "S3 업로드 성공",
    });
  } catch (error) {
    console.error("Error in uploadImages:", error);
    return res.status(500).json({ status: "error", message: "S3 업로드 실패" });
  }
};

// -------------------- API 2️⃣ MongoDB 저장 --------------------
const createUser = async (req: Request, res: Response<ResponseData>) => {
  try {
    const { personalInfo, magazineInfo, imageUrls } = req.body;
    if (!personalInfo || !magazineInfo || !imageUrls) {
      return res
        .status(400)
        .json({ status: "error", message: "필수 정보 누락" });
    }

    const newUser = await userRepository.create({
      ...personalInfo,
      status: "pending",
      imageUrls,
      magazine: {
        ...magazineInfo,
        createdAt: new Date().toISOString(),
      },
      createdAt: new Date(),
    });

    return res
      .status(201)
      .json({ status: "success", data: newUser, message: "DB 저장 성공" });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ status: "error", message: "DB 저장 실패" });
  }
};

// -------------------- API 3️⃣ 이메일 발송 --------------------
const sendNotification = async (req: Request, res: Response<ResponseData>) => {
  try {
    const { userId, uploadedImageUrls } = req.body;
    if (!userId || !uploadedImageUrls) {
      return res
        .status(400)
        .json({ status: "error", message: "필수 정보 누락" });
    }

    const user = await userRepository.findById(userId);
    if (!user)
      return res.status(404).json({ status: "error", message: "사용자 없음" });

    const verificationToken = generateVerificationToken(userId);
    await emailService.sendAdminNotification(
      user,
      uploadedImageUrls,
      verificationToken
    );

    return res
      .status(200)
      .json({ status: "success", message: "이메일 발송 완료" });
  } catch (error) {
    console.error("Error in sendNotification:", error);
    return res
      .status(500)
      .json({ status: "error", message: "이메일 발송 실패" });
  }
};

// 보안 토큰 생성
const generateVerificationToken = (userId: string): string => {
  return crypto
    .createHmac("sha256", process.env.SECRET_KEY || "magazine-secret-key")
    .update(userId)
    .digest("hex");
};

// 관리자 승인 처리 API
const approveMagazine = async (req: Request, res: Response) => {
  try {
    const { id, token } = req.body;

    if (!id || !token) {
      return res.status(400).json({
        status: "error",
        message: "유효하지 않은 요청입니다.",
      });
    }

    // 토큰 유효성 검증
    const expectedToken = generateVerificationToken(id);
    if (token !== expectedToken) {
      return res.status(401).json({
        status: "error",
        message: "인증 토큰이 유효하지 않습니다.",
      });
    }

    // Repository 패턴 사용 - 사용자 조회
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "해당 매거진을 찾을 수 없습니다.",
      });
    }

    if (user.status === "approved") {
      return res.status(200).json({
        status: "success",
        message: "이미 승인된 매거진입니다.",
      });
    }

    // Repository 패턴 사용 - 상태 업데이트
    const updatedUser = await userRepository.updateById(id, {
      status: "approved",
      approvedAt: new Date(),
    });

    // Service Layer 사용 - 승인 이메일 발송
    await emailService.sendApprovalEmail(updatedUser);

    return res.status(200).json({
      status: "success",
      message: "매거진이 성공적으로 승인되었습니다.",
    });
  } catch (error) {
    console.error("Error in approveMagazine:", error);
    return res.status(500).json({
      status: "error",
      message: "승인 처리 중 오류가 발생했습니다.",
    });
  }
};

// 관리자 거절 처리 API
const rejectMagazine = async (req: Request, res: Response) => {
  try {
    const { id, token, reason } = req.body;

    if (!id || !token) {
      return res.status(400).json({
        status: "error",
        message: "유효하지 않은 요청입니다.",
      });
    }

    // 토큰 유효성 검증
    const expectedToken = generateVerificationToken(id);
    if (token !== expectedToken) {
      return res.status(401).json({
        status: "error",
        message: "인증 토큰이 유효하지 않습니다.",
      });
    }

    // Repository 패턴 사용 - 사용자 조회
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "해당 매거진을 찾을 수 없습니다.",
      });
    }

    if (user.status === "rejected") {
      return res.status(200).json({
        status: "success",
        message: "이미 거절된 매거진입니다.",
      });
    }

    // Repository 패턴 사용 - 상태 업데이트
    const updatedUser = await userRepository.updateById(id, {
      status: "rejected",
      rejectionReason: reason || "관리자에 의해 거절되었습니다.",
      rejectedAt: new Date(),
    });

    // Service Layer 사용 - 거절 이메일 발송
    await emailService.sendRejectionEmail(updatedUser, reason || "");

    return res.status(200).json({
      status: "success",
      message: "매거진이 성공적으로 거절되었습니다.",
    });
  } catch (error) {
    console.error("Error in rejectMagazine:", error);
    return res.status(500).json({
      status: "error",
      message: "거절 처리 중 오류가 발생했습니다.",
    });
  }
};

// 사용자 데이터 조회 API
const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { id, token } = req.query;

    if (!id || !token || typeof id !== "string" || typeof token !== "string") {
      return res.status(400).json({
        status: "error",
        message: "유효하지 않은 요청입니다.",
      });
    }

    // 토큰 유효성 검증
    const expectedToken = generateVerificationToken(id);
    if (token !== expectedToken) {
      return res.status(401).json({
        status: "error",
        message: "인증 토큰이 유효하지 않습니다.",
      });
    }

    // Repository 패턴 사용 - 사용자 조회
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "해당 매거진을 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    return res.status(500).json({
      status: "error",
      message: "사용자 데이터를 가져오는 중 오류가 발생했습니다.",
    });
  }
};

module.exports = {
  uploadImages,
  createUser,
  sendNotification,
  getUserDetails,
  approveMagazine,
  rejectMagazine,
};
