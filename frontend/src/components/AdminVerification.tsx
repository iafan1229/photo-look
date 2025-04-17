"use client";
import { Base64 } from "js-base64";
import { useState, useEffect } from "react";
import axios from "axios";
import pako from "pako";
import "@/styles/components/admin.scss";
import { UserData } from "@/type/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// 압축 해제 함수
const decompressData = (compressedBase64: string): any => {
  try {
    // Base64 디코딩
    const binaryString = Base64.decode(compressedBase64);

    // 바이너리 문자열을 Uint8Array로 변환
    const charArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      charArray[i] = binaryString.charCodeAt(i);
    }

    // 압축 해제
    const decompressed = pako.inflate(charArray);

    // Uint8Array를 문자열로 변환
    const jsonString = new TextDecoder().decode(decompressed);

    // JSON 파싱
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("압축 해제 오류:", error);
    throw error;
  }
};

export default function AdminVerification({
  token,
  action,
}: {
  token: string;
  action: string;
}) {
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [result, setResult] = useState({
    show: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    try {
      // 토큰 디코딩
      const jsonStr = Base64.decode(token);

      const decodedData = decompressData(token);
      const { userData, timestamp } = decodedData;

      // 토큰 유효성 검증 (24시간)
      if (Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) {
        setResult({
          show: true,
          success: false,
          message: "토큰이 만료되었습니다. 새로운 요청을 생성해주세요.",
        });
        return;
      }

      setUserData(userData);

      // 액션 파라미터가 있으면 자동 실행
      if (action === "reject") {
        setShowReasonInput(true);
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      setResult({
        show: true,
        success: false,
        message: "토큰 처리 중 오류가 발생했습니다.",
      });
    }
  }, [token, action]);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/verification/approve`, {
        token,
      });

      if (response.data.status === "success") {
        setResult({
          show: true,
          success: true,
          message: "매거진이 성공적으로 승인되었습니다.",
        });

        // 3초 후 창 닫기
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    } catch (error) {
      console.error("Error approving magazine:", error);
      setResult({
        show: true,
        success: false,
        message: "매거진 승인 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!showReasonInput) {
      setShowReasonInput(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/verification/reject`, {
        token,
        reason: rejectionReason || "관리자에 의해 거절되었습니다.",
      });

      if (response.data.status === "success") {
        setResult({
          show: true,
          success: true,
          message: "매거진이 거절되었습니다.",
        });

        // 3초 후 창 닫기
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    } catch (error) {
      console.error("Error rejecting magazine:", error);
      setResult({
        show: true,
        success: false,
        message: "매거진 거절 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (result.show) {
    return (
      <div className='container'>
        <div className={result.success ? "successResult" : "errorResult"}>
          {result.message}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='container'>
        <div className='loading'>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='header'>
        <h1>매거진 등록 검증</h1>
      </div>

      {loading ? (
        <div className='loading'>처리 중입니다...</div>
      ) : (
        <div className='content'>
          <div className='infoGroup'>
            <span className='infoLabel'>매거진 제목:</span>
            <span>{userData.magazine.title}</span>
          </div>

          <div className='infoGroup'>
            <span className='infoLabel'>사용자 이름:</span>
            <span>{userData.personalInfo.name}</span>
          </div>

          <div className='infoGroup'>
            <span className='infoLabel'>이메일:</span>
            <span>{userData.personalInfo.email}</span>
          </div>

          <div className='infoGroup'>
            <span className='infoLabel'>연락처:</span>
            <span>{userData.personalInfo.phoneNumber}</span>
          </div>

          <div className='infoGroup'>
            <span className='infoLabel'>SNS:</span>
            <span>{userData.personalInfo?.snsId || "미입력"}</span>
          </div>

          <div className='infoGroup'>
            <span className='infoLabel'>요청 날짜:</span>
            <span>
              {new Date(userData.magazine.createdAt).toLocaleString("ko-KR")}
            </span>
          </div>

          <div className='infoGroup'>
            <span className='infoLabel'>이미지:</span>
            <div className='imageGallery'>
              {userData.imageUrls.map((url: string, index: number) => (
                <div key={index} className='imageItem'>
                  <img src={url} alt='Magazine Image' />
                  <a href={url} target='_blank' rel='noopener noreferrer'>
                    원본 보기
                  </a>
                </div>
              ))}
            </div>
          </div>

          {showReasonInput && (
            <textarea
              className='reasonInput'
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder='거절 사유를 입력하세요...'
            />
          )}

          <div className='buttonGroup'>
            <button className='button approveBtn' onClick={handleApprove}>
              승인하기
            </button>
            <button className='button rejectBtn' onClick={handleReject}>
              거절하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
