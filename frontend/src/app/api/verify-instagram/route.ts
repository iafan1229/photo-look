// app/api/verify-instagram/route.js
import { NextResponse } from "next/server";
import axios from "axios";

// Instagram API를 통해 특정 게시물의 댓글을 검증하는 함수
async function verifyComment(
  mediaId: string,
  instagramUsername: string,
  expectedCode: string
) {
  try {
    // 액세스 토큰은 보안을 위해 환경 변수로 관리해야 합니다
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || "";

    // Instagram Graph API 엔드포인트 (댓글 가져오기)
    const apiUrl = `https://graph.instagram.com/${mediaId}/comments?fields=text,username&access_token=${accessToken}`;

    // API 호출
    const response = await axios.get(apiUrl);

    // 댓글 데이터 가져오기
    const comments = response.data.data || [];

    if (comments.length === 0) {
      return { verified: false, reason: "해당 게시물에 댓글이 없습니다." };
    }

    // 특정 사용자가 남긴 댓글 중 특정 코드를 포함한 댓글 검색
    const foundComment = comments.find(
      (comment: { username: string; text: string | string[] }) =>
        comment.username === instagramUsername &&
        comment.text.includes(expectedCode)
    );

    if (foundComment) {
      return { verified: true };
    } else {
      // 댓글은 있지만 일치하는 내용을 찾지 못한 경우
      const userComments = comments.filter(
        (comment: { username: string }) =>
          comment.username === instagramUsername
      );

      if (userComments.length > 0) {
        return {
          verified: false,
          reason: "인증 코드가 포함된 댓글을 찾을 수 없습니다.",
        };
      } else {
        return {
          verified: false,
          reason: `${instagramUsername} 계정으로 작성된 댓글을 찾을 수 없습니다.`,
        };
      }
    }
  } catch (error: any) {
    console.error("Instagram API 오류:", error.response?.data || error.message);
    return {
      verified: false,
      reason: "인스타그램 API 연결 중 오류가 발생했습니다.",
    };
  }
}

// POST 핸들러
export async function POST(request: { json: () => any }) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    const { instagramId, verificationCode, postId } = body;

    if (!instagramId || !verificationCode || !postId) {
      return NextResponse.json(
        { success: false, message: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 댓글 검증
    const { verified, reason } = await verifyComment(
      postId,
      instagramId,
      verificationCode
    );

    if (verified) {
      return NextResponse.json(
        { success: true, message: "인증이 성공했습니다." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: reason || "인증이 실패했습니다." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("인증 처리 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
