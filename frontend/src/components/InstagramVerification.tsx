// pages/instagram-verification.js
import { useState, useEffect } from "react";
import Head from "next/head";

export default function InstagramVerification() {
  const [instagramId, setInstagramId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifiedUserId, setVerifiedUserId] = useState("");

  // 인증 시작 핸들러
  const handleStartVerification = async () => {
    if (instagramId.trim() === "") {
      alert("인스타그램 아이디를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/front/api/verify-comment?verification_code=${encodeURIComponent(
          instagramId
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.userId) {
        setIsVerified(true);
        setVerifiedUserId(data.userId);
        alert("인증이 완료되었습니다!");
      } else {
        setErrorMessage(
          data.message || "인증에 실패했습니다. 아이디를 확인해주세요."
        );
      }
    } catch (error) {
      console.error("인증 API 호출 오류:", error);
      setErrorMessage(
        "인증 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 정보 리셋 핸들러
  const handleReset = () => {
    setInstagramId("");
    setIsVerified(false);
    setVerifiedUserId("");
    setErrorMessage("");
  };

  // 가상의 인스타그램 계정 정보
  const officialAccount = "daily_9230";
  const verificationPostUrl = "https://www.instagram.com/p/DHp8515SJec/";

  return (
    <div className='container d-flex align-items-center justify-content-center min-vh-100 py-5'>
      <div
        className='card shadow-sm'
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className='card-body p-4'>
          <h1 className='card-title text-center mb-4 fw-bold'>
            인스타그램 계정 인증
          </h1>

          {!isVerified && (
            <>
              <div className='alert alert-warning mb-4'>
                <h5 className='fw-semibold'>인증 방법</h5>
                <ol className='mb-0'>
                  <li className='mb-2'>
                    <a
                      href={`https://www.instagram.com/${officialAccount}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-decoration-none'
                    >
                      @{officialAccount}
                    </a>{" "}
                    계정을 팔로우해주세요.
                  </li>
                  <li className='mb-2'>
                    <a
                      href={verificationPostUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-decoration-none'
                    >
                      이 게시물
                    </a>
                    에 본인의 인스타그램 계정으로 댓글을 작성해주세요.
                  </li>
                  <li>
                    댓글 작성 후 아래에 본인의 인스타그램 아이디를 입력하고
                    인증하기 버튼을 클릭해주세요.
                  </li>
                </ol>
              </div>

              <div className='mb-4'>
                <label htmlFor='instagram-id' className='form-label'>
                  인스타그램 아이디
                </label>
                <div className='input-group mb-3'>
                  <input
                    type='text'
                    id='instagram-id'
                    className='form-control'
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                    placeholder='인스타그램 아이디 입력'
                  />
                  <button
                    className='btn btn-primary'
                    onClick={handleStartVerification}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className='spinner-border spinner-border-sm me-1'
                          role='status'
                          aria-hidden='true'
                        ></span>
                        확인 중...
                      </>
                    ) : (
                      "인증하기"
                    )}
                  </button>
                </div>
                {errorMessage && (
                  <div className='alert alert-danger mt-3'>{errorMessage}</div>
                )}
              </div>
            </>
          )}

          {isVerified && (
            <div>
              <div className='alert alert-success mb-4'>
                <h5 className='fw-semibold'>인증이 완료되었습니다!</h5>
                <p className='mb-0'>
                  인스타그램 계정 <strong>{verifiedUserId}</strong>가 성공적으로
                  인증되었습니다.
                </p>
              </div>
              <button className='btn btn-secondary w-100' onClick={handleReset}>
                다시 인증하기
              </button>
            </div>
          )}

          <div className='mt-4 small text-muted'>
            <p className='mb-1'>
              * 인증이 확인되지 않는 경우, 잠시 후 다시 시도해주세요.
            </p>
            <p className='mb-0'>
              * 인증에 문제가 있을 경우 고객센터로 문의해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
