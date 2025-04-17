// server/src/controllers/verificationController.ts
import { Request, Response } from "express";
import { ResponseData, User } from "../types";
const nodemailer = require("nodemailer");
const UserModel = require("../models/User");
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

// 이메일 트랜스포터 설정
const transporter = nodemailer.createTransport({
  host: "smtp.naver.com",
  port: 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.EMAIL_USER || "home124@naver.com",
    pass: process.env.EMAIL_PASSWORD || "", // 이메일 계정 비밀번호 또는 앱 비밀번호
  },
});

// 보안 토큰 생성 (간단한 암호화 해시)
const generateVerificationToken = (userId: string): string => {
  return crypto
    .createHmac("sha256", process.env.SECRET_KEY || "magazine-secret-key")
    .update(userId)
    .digest("hex");
};

// S3에 이미지 업로드 및 이메일 발송 핸들러
const uploadToS3AndNotify = async (
  req: Request,
  res: Response<ResponseData>
) => {
  try {
    const { images, personalInfo, magazineTitle, storyTheme, magazineStyle } =
      req.body;

    if (!images || !personalInfo || !magazineTitle) {
      return res.status(400).json({
        status: "error",
        message: "필수 정보가 누락되었습니다.",
      });
    }

    // 업로드된 이미지 URL 저장 배열
    const uploadedImageUrls: string[] = [];

    // 각 이미지를 S3에 업로드
    for (const image of images) {
      const imageId = uuidv4();
      const base64Data = image.dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const fileExtension = image.dataUrl.split(";")[0].split("/")[1];
      const fileName = `${imageId}.${fileExtension}`;

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || "your-bucket-name",
        Key: `magazine-images/${fileName}`,
        Body: buffer,
        ContentType: `image/${fileExtension}`,
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      // S3 URL 생성
      const imageUrl = `https://${uploadParams.Bucket}.s3.${
        process.env.AWS_REGION || "ap-northeast-2"
      }.amazonaws.com/${uploadParams.Key}`;
      uploadedImageUrls.push(imageUrl);
    }

    // MongoDB에 'pending' 상태로 사용자 데이터 저장
    const newUser = await new UserModel({
      name: personalInfo.name,
      email: personalInfo.email,
      phoneNumber: personalInfo.phoneNumber,
      snsId: personalInfo.snsId || "",
      status: "pending", // 승인 대기 상태로 설정
      imageUrls: uploadedImageUrls,
      magazine: {
        title: magazineTitle,
        theme: storyTheme,
        style: magazineStyle,
        analyzedImages: images.map((img: any) => ({
          name: img.name || "",
          analysis: img.analysis?.labels?.map((el: { description: any }) => {
            return {
              description: el.description,
            };
          }) || {
            labels: [],
          },
          storyText: img.storyText || "",
        })),
        createdAt: new Date().toISOString(),
      },
      createdAt: new Date(),
    }).save();

    // 사용자 ID와 보안 토큰 생성
    const userId = newUser._id.toString();
    const verificationToken = generateVerificationToken(userId);

    // 관리자에게 보낼 이메일 HTML 생성
    const emailHtml = `
      <h2>새로운 매거진 등록 요청</h2>
      <p><strong>요청 날짜:</strong> ${new Date().toLocaleString("ko-KR")}</p>
      <h3>사용자 정보:</h3>
      <ul>
        <li><strong>이름:</strong> ${personalInfo.name}</li>
        <li><strong>이메일:</strong> ${personalInfo.email}</li>
        <li><strong>휴대폰:</strong> ${personalInfo.phoneNumber}</li>
        <li><strong>SNS 아이디:</strong> ${personalInfo.snsId || "미입력"}</li>
      </ul>
      <h3>매거진 정보:</h3>
      <p><strong>제목:</strong> ${magazineTitle}</p>
      <h3>업로드된 이미지:</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        ${uploadedImageUrls
          .map(
            (url) => `
          <div style="width: 200px; margin-bottom: 10px;">
            <img src="${url}" alt="Magazine Image" style="width: 100%; max-height: 150px; object-fit: cover;">
            <a href="${url}" target="_blank" style="display: block; margin-top: 5px; font-size: 12px; overflow: hidden; text-overflow: ellipsis;">이미지 보기</a>
          </div>
        `
          )
          .join("")}
      </div>
      <div style="margin-top: 30px;">
        <a href="${
          process.env.SITE_URL
        }/admin/verification?id=${userId}&token=${verificationToken}&action=approve" 
          style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px;">
          등록 승인하기
        </a>
        <a href="${
          process.env.SITE_URL
        }/admin/verification?id=${userId}&token=${verificationToken}&action=reject" 
          style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          등록 거절하기
        </a>
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #777;">
        이 이메일은 자동 발송되었습니다. 궁금한 점이 있으시면 관리자에게 문의하세요.
      </p>
    `;

    // 이메일 옵션 설정
    const mailOptions = {
      from: `"매거진 등록 시스템" <${
        process.env.EMAIL_USER || "home124@naver.com"
      }>`,
      to: "home124@naver.com", // 관리자 이메일
      subject: `[매거진 등록 요청] ${personalInfo.name}님의 "${magazineTitle}" 등록 요청`,
      html: emailHtml,
    };

    // 이메일 발송
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      status: "success",
      message: "이미지 업로드 및 인증 요청 이메일이 성공적으로 전송되었습니다.",
    });
  } catch (error) {
    console.error("Error in uploadToS3AndNotify:", error);
    return res.status(500).json({
      status: "error",
      message: "서버 오류가 발생했습니다.",
    });
  }
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

    // MongoDB에서 사용자 찾기
    const user = await UserModel.findById(id);
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

    // 상태 업데이트
    user.status = "approved";
    user.approvedAt = new Date();
    await user.save();

    // 사용자에게 승인 알림 이메일 전송
    if (user.email) {
      const userMailOptions = {
        from: `"매거진 등록 시스템" <${
          process.env.EMAIL_USER || "home124@naver.com"
        }>`,
        to: user.email,
        subject: `[매거진 등록 완료] "${user.magazine.title}" 등록이 승인되었습니다`,
        html: `
          <h2>${user.name}님, 매거진 등록이 완료되었습니다!</h2>
          <p>요청하신 "${user.magazine.title}" 매거진이 성공적으로 홈페이지에 등록되었습니다.</p>
          <p>홈페이지에서 확인하실 수 있습니다.</p>
          <p>감사합니다.</p>
        `,
      };

      await transporter.sendMail(userMailOptions);
    }

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

    // MongoDB에서 사용자 찾기
    const user = await UserModel.findById(id);
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

    // 상태 업데이트
    user.status = "rejected";
    user.rejectionReason = reason || "관리자에 의해 거절되었습니다.";
    user.rejectedAt = new Date();
    await user.save();

    // 사용자에게 거절 알림 이메일 전송
    if (user.email) {
      const rejectionReason = reason || "관리자에 의해 거절되었습니다.";

      const userMailOptions = {
        from: `"매거진 등록 시스템" <${
          process.env.EMAIL_USER || "home124@naver.com"
        }>`,
        to: user.email,
        subject: `[매거진 등록 거절] "${user.magazine.title}" 등록이 거절되었습니다`,
        html: `
          <h2>${user.name}님, 매거진 등록이 거절되었습니다.</h2>
          <p>요청하신 "${user.magazine.title}" 매거진 등록이 다음의 이유로 거절되었습니다:</p>
          <p style="background-color: #f8f8f8; padding: 10px; border-left: 4px solid #f44336;">
            ${rejectionReason}
          </p>
          <p>문의사항이 있으시면 관리자에게 연락해주세요.</p>
        `,
      };

      await transporter.sendMail(userMailOptions);
    }

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

// 사용자 데이터 조회 API (verificationController.ts에 추가)
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

    // MongoDB에서 사용자 찾기
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "해당 매거진을 찾을 수 없습니다.",
      });
    }

    // 사용자 데이터 반환
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

// module.exports에 함수 추가
module.exports = {
  uploadToS3AndNotify,
  getUserDetails, // 이 부분을 추가
  approveMagazine,
  rejectMagazine,
};
