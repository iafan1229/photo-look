// frontend/src/app/admin/verification/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "@/styles/components/admin.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function VerificationPage() {
  const [id, setId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [result, setResult] = useState({
    show: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    // URL에서 쿼리 파라미터 가져오기
    const queryParams = new URLSearchParams(window.location.search);
    const idParam = queryParams.get("id");
    const tokenParam = queryParams.get("token");
    const actionParam = queryParams.get("action");

    if (!idParam || !tokenParam) {
      setResult({
        show: true,
        success: false,
        message: "유효하지 않은 요청입니다. ID 또는 토큰이 누락되었습니다.",
      });
      setLoading(false);
      return;
    }

    setId(idParam);
    setToken(tokenParam);

    if (actionParam === "reject") {
      setAction("reject");
      setShowReasonInput(true);
    } else {
      setAction("approve");
    }

    // 사용자 데이터 가져오기
    fetchUserData(idParam, tokenParam);
  }, []);

  const fetchUserData = async (userId: string, verificationToken: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/verification/details?id=${userId}&token=${verificationToken}`
      );

      if (response.data.status === "success") {
        setUserData(response.data.data);
      } else {
        setResult({
          show: true,
          success: false,
          message: response.data.message || "데이터를 가져오는데 실패했습니다.",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setResult({
        show: true,
        success: false,
        message: "사용자 데이터를 가져오는 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/verification/approve`, {
        id,
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
      } else {
        setResult({
          show: true,
          success: false,
          message: response.data.message || "승인 처리 중 오류가 발생했습니다.",
        });
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
      const response = await axios.post(`${API_URL}/api/verification/reject`, {
        id,
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
      } else {
        setResult({
          show: true,
          success: false,
          message: response.data.message || "거절 처리 중 오류가 발생했습니다.",
        });
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

  if (loading) {
    return (
      <div className='container'>
        <div className='loading'>로딩 중...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='container'>
        <div className='errorResult'>사용자 데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='header'>
        <h1>매거진 등록 검증</h1>
      </div>

      <div className='content'>
        <div className='infoGroup'>
          <span className='infoLabel'>매거진 제목:</span>
          <span>{userData.magazine.title}</span>
        </div>

        <div className='infoGroup'>
          <span className='infoLabel'>사용자 이름:</span>
          <span>{userData.name}</span>
        </div>

        <div className='infoGroup'>
          <span className='infoLabel'>이메일:</span>
          <span>{userData.email}</span>
        </div>

        <div className='infoGroup'>
          <span className='infoLabel'>연락처:</span>
          <span>{userData.phoneNumber}</span>
        </div>

        <div className='infoGroup'>
          <span className='infoLabel'>SNS:</span>
          <span>{userData?.snsId || "미입력"}</span>
        </div>

        <div className='infoGroup'>
          <span className='infoLabel'>요청 날짜:</span>
          <span>{new Date(userData.createdAt).toLocaleString("ko-KR")}</span>
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
    </div>
  );
}
