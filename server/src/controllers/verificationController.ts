// server/src/controllers/verificationController.ts
import { Request, Response } from "express";
import { ResponseData, User, PersonalInfo } from "../types";
const nodemailer = require("nodemailer");
const UserModel = require("../models/User");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

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
        // ACL: "public-read" 제거 - PutObjectAcl 권한 오류 방지
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      // S3 URL 생성
      const imageUrl = `https://${uploadParams.Bucket}.s3.${
        process.env.AWS_REGION || "ap-northeast-2"
      }.amazonaws.com/${uploadParams.Key}`;
      uploadedImageUrls.push(imageUrl);
    }

    // MongoDB에 저장하지 않고 모든 정보를 토큰에 담기
    const userData = {
      personalInfo: {
        name: personalInfo.name,
        email: personalInfo.email,
        phoneNumber: personalInfo.phoneNumber,
        snsId: personalInfo.snsId || "",
      },
      imageUrls: uploadedImageUrls,
      magazine: {
        title: magazineTitle,
        theme: storyTheme,
        style: magazineStyle,
        analyzedImages: images.map((img: any) => ({
          name: img.name || "",
          analysis: img.analysis || { labels: [] },
          storyText: img.storyText || "",
        })),
        createdAt: new Date().toISOString(),
      },
    };

    // 모든 정보를 포함한 승인 토큰 생성
    const approvalToken = Buffer.from(
      JSON.stringify({
        userData: userData,
        timestamp: Date.now(),
      })
    ).toString("base64");

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
          process.env.SITE_URL || "http://localhost:8080"
        }/api/verification/approve?token=${approvalToken}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px;">
           등록 승인하기
        </a>
        <a href="${
          process.env.SITE_URL || "http://localhost:8080"
        }/api/verification/reject?token=${approvalToken}" 
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

// 관리자 승인 처리 핸들러
const approveMagazine = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).send("<h1>유효하지 않은 토큰입니다.</h1>");
    }

    // 토큰 디코딩
    const decodedData = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    );
    const { userData, timestamp } = decodedData;

    // 토큰 유효성 검증 (24시간)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      return res.status(400).send("<h1>토큰이 만료되었습니다.</h1>");
    }

    // 이제 승인되었으므로 MongoDB에 저장
    const user = await new UserModel({
      name: userData.personalInfo.name,
      email: userData.personalInfo.email,
      phoneNumber: userData.personalInfo.phoneNumber,
      snsId: userData.personalInfo.snsId,
      status: "approved", // 바로 승인된 상태로 저장
      imageUrls: userData.imageUrls,
      magazine: userData.magazine,
      approvedAt: new Date(),
    }).save();

    // 사용자에게 승인 알림 이메일 전송
    if (userData.personalInfo.email) {
      const userMailOptions = {
        from: `"매거진 등록 시스템" <${
          process.env.EMAIL_USER || "home124@naver.com"
        }>`,
        to: userData.personalInfo.email,
        subject: `[매거진 등록 완료] "${userData.magazine.title}" 등록이 승인되었습니다`,
        html: `
          <h2>${userData.personalInfo.name}님, 매거진 등록이 완료되었습니다!</h2>
          <p>요청하신 "${userData.magazine.title}" 매거진이 성공적으로 홈페이지에 등록되었습니다.</p>
          <p>홈페이지에서 확인하실 수 있습니다.</p>
          <p>감사합니다.</p>
        `,
      };

      await transporter.sendMail(userMailOptions);
    }

    // HTML 응답 반환
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>매거진 등록 승인</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          .success {
            color: #4CAF50;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .info {
            margin-bottom: 15px;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
        <script>
          function showAlert() {
            alert('저장 성공');
            window.close();
          }
          window.onload = showAlert;
        </script>
      </head>
      <body>
        <div class="success">매거진 등록 승인 완료!</div>
        <div class="info"><strong>매거진 제목:</strong> ${
          userData.magazine.title
        }</div>
        <div class="info"><strong>사용자:</strong> ${
          userData.personalInfo.name
        }</div>
        <div class="info"><strong>등록된 이미지:</strong> ${
          userData.imageUrls.length
        }개</div>
        <div class="info"><strong>승인 일시:</strong> ${new Date().toLocaleString(
          "ko-KR"
        )}</div>
        <p>매거진이 성공적으로 등록되었습니다.</p>
        <a href="#" class="button" onclick="window.close()">창 닫기</a>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error in approveMagazine:", error);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>오류 발생</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          .error {
            color: #f44336;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background-color: #f44336;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="error">오류가 발생했습니다</div>
        <p>매거진 등록 승인 중 문제가 발생했습니다. 다시 시도해주세요.</p>
        <a href="#" class="button" onclick="window.close()">창 닫기</a>
      </body>
      </html>
    `);
  }
};

// 관리자 거절 처리 핸들러
const rejectMagazine = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const { reason } = req.body || {};

    if (!token || typeof token !== "string") {
      return res.status(400).send("<h1>유효하지 않은 토큰입니다.</h1>");
    }

    // 토큰 디코딩
    const decodedData = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    );
    const { userData, timestamp } = decodedData;

    // 토큰 유효성 검증 (24시간)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      return res.status(400).send("<h1>토큰이 만료되었습니다.</h1>");
    }

    // 거절된 경우 MongoDB에 저장하지 않음
    // 선택적으로 거절 기록을 남기고 싶다면 아래 주석을 해제
    /*
    const rejectedUser = await new UserModel({
      name: userData.personalInfo.name,
      email: userData.personalInfo.email,
      phoneNumber: userData.personalInfo.phoneNumber,
      snsId: userData.personalInfo.snsId,
      status: "rejected",
      rejectionReason: reason || "관리자에 의해 거절되었습니다.",
      imageUrls: userData.imageUrls,
      magazine: userData.magazine,
      rejectedAt: new Date(),
    }).save();
    */

    // 사용자에게 거절 알림 이메일 전송
    if (userData.personalInfo.email) {
      const rejectionReason = reason || "관리자에 의해 거절되었습니다.";

      const userMailOptions = {
        from: `"매거진 등록 시스템" <${
          process.env.EMAIL_USER || "home124@naver.com"
        }>`,
        to: userData.personalInfo.email,
        subject: `[매거진 등록 거절] "${userData.magazine.title}" 등록이 거절되었습니다`,
        html: `
          <h2>${userData.personalInfo.name}님, 매거진 등록이 거절되었습니다.</h2>
          <p>요청하신 "${userData.magazine.title}" 매거진 등록이 다음의 이유로 거절되었습니다:</p>
          <p style="background-color: #f8f8f8; padding: 10px; border-left: 4px solid #f44336;">
            ${rejectionReason}
          </p>
          <p>문의사항이 있으시면 관리자에게 연락해주세요.</p>
        `,
      };

      await transporter.sendMail(userMailOptions);
    }

    // HTML 응답 반환
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>매거진 등록 거절</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          .rejected {
            color: #f44336;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .info {
            margin-bottom: 15px;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
        <script>
          function showAlert() {
            alert('매거진 등록이 거절되었습니다');
            window.close();
          }
          window.onload = showAlert;
        </script>
      </head>
      <body>
        <div class="rejected">매거진 등록 거절 완료</div>
        <div class="info"><strong>매거진 제목:</strong> ${
          userData.magazine.title
        }</div>
        <div class="info"><strong>사용자:</strong> ${
          userData.personalInfo.name
        }</div>
        <div class="info"><strong>거절 사유:</strong> ${
          reason || "관리자에 의해 거절되었습니다."
        }</div>
        <div class="info"><strong>거절 일시:</strong> ${new Date().toLocaleString(
          "ko-KR"
        )}</div>
        <p>매거진 등록이 거절되었으며, 사용자에게 알림 이메일이 발송되었습니다.</p>
        <a href="#" class="button" onclick="window.close()">창 닫기</a>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error in rejectMagazine:", error);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>오류 발생</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          .error {
            color: #f44336;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background-color: #f44336;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="error">오류가 발생했습니다</div>
        <p>매거진 등록 거절 중 문제가 발생했습니다. 다시 시도해주세요.</p>
        <a href="#" class="button" onclick="window.close()">창 닫기</a>
      </body>
      </html>
    `);
  }
};

module.exports = {
  uploadToS3AndNotify,
  approveMagazine,
  rejectMagazine,
};
