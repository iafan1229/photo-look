// server/src/services/emailService.ts
import nodemailer from "nodemailer";

// 이메일 설정
const transporter = nodemailer.createTransport({
  host: "smtp.naver.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "home124@naver.com",
    pass: process.env.EMAIL_PASSWORD || "",
  },
});

// Service Layer 패턴 - 이메일 관련 비즈니스 로직 분리
export const emailService = {
  // 관리자에게 새 매거진 등록 알림
  async sendAdminNotification(
    user: any,
    uploadedImageUrls: string[],
    verificationToken: string
  ) {
    const userId = user._id.toString();

    const mailOptions = {
      from: `"매거진 등록 시스템" <${
        process.env.EMAIL_USER || "home124@naver.com"
      }>`,
      to: "home124@naver.com",
      subject: `[매거진 등록 요청] ${user.name}님의 "${user.magazine.title}" 등록 요청`,
      html: `
        <h2>새로운 매거진 등록 요청</h2>
        <p><strong>요청 날짜:</strong> ${new Date().toLocaleString("ko-KR")}</p>
        <h3>사용자 정보:</h3>
        <ul>
          <li><strong>이름:</strong> ${user.name}</li>
          <li><strong>이메일:</strong> ${user.email}</li>
          <li><strong>휴대폰:</strong> ${user.phoneNumber}</li>
          <li><strong>SNS 아이디:</strong> ${user.snsId || "미입력"}</li>
        </ul>
        <h3>매거진 정보:</h3>
        <p><strong>제목:</strong> ${user.magazine.title}</p>
        <h3>업로드된 이미지:</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${uploadedImageUrls
            .map(
              (url) => `
            <div style="width: 200px; margin-bottom: 10px;">
              <img src="${url}" alt="Magazine Image" style="width: 100%; max-height: 150px; object-fit: cover;">
              <a href="${url}" target="_blank" style="display: block; margin-top: 5px; font-size: 12px;">이미지 보기</a>
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
      `,
    };

    return await transporter.sendMail(mailOptions);
  },

  // 사용자에게 승인 알림
  async sendApprovalEmail(user: any) {
    if (!user.email) return;

    const mailOptions = {
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

    return await transporter.sendMail(mailOptions);
  },

  // 사용자에게 거절 알림
  async sendRejectionEmail(user: any, reason: string) {
    if (!user.email) return;

    const rejectionReason = reason || "관리자에 의해 거절되었습니다.";
    const mailOptions = {
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

    return await transporter.sendMail(mailOptions);
  },
};
