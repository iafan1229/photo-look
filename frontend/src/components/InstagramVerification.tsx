// pages/instagram-verification.js
import { useState, useEffect } from "react";
import Head from "next/head";

export default function InstagramVerification() {
  const [instagramId, setInstagramId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [randomText, setRandomText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 랜덤 코드 생성 함수
  const generateRandomCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 8;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  };

  // 인증 시작 핸들러
  const handleStartVerification = () => {
    if (instagramId.trim() === "") {
      alert("인스타그램 아이디를 입력해주세요.");
      return;
    }

    // 랜덤 코드 생성
    const newRandomCode = generateRandomCode();
    setRandomText(newRandomCode);
    setIsVerifying(true);
    setErrorMessage("");
  };

  // 인증 코드 확인 핸들러
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      alert("인증 코드를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // API 엔드포인트로 데이터 전송
      const response = await fetch("/api/verify-instagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: "DHp8515SJec", // 실제 사용 시 적절한 게시물 ID로 변경
          instagramId,
          verificationCode: randomText,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        alert("OK");
      } else {
        setErrorMessage(
          data.message || "인증에 실패했습니다. 댓글을 확인해주세요."
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
    setVerificationCode("");
    setRandomText("");
    setIsVerifying(false);
    setIsVerified(false);
    setErrorMessage("");
  };

  // 가상의 인스타그램 계정 정보 - 실제 서비스에서는 환경 변수로 관리하는 것이 좋습니다
  const officialAccount = "daily_9230";
  const verificationPostUrl = `https://www.instagram.com/p/DHp8515SJec/`;

  return (
    <>
      <div className='container d-flex align-items-center justify-content-center min-vh-100 py-5'>
        <div
          className='card shadow-sm'
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <div className='card-body p-4'>
            <h1 className='card-title text-center mb-4 fw-bold'>
              인스타그램 계정 인증
            </h1>

            {!isVerifying && !isVerified && (
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
                  >
                    인증 시작
                  </button>
                </div>
              </div>
            )}

            {isVerifying && !isVerified && (
              <div>
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
                      에 아래 코드를 댓글로 작성해주세요.
                    </li>
                    <li>댓글 작성 후 아래 확인 버튼을 클릭해주세요.</li>
                  </ol>
                </div>

                <div className='card bg-light mb-4'>
                  <div className='card-body text-center'>
                    <p className='card-text text-muted mb-1'>인증 코드:</p>
                    <p className='card-text fw-bold fs-5 font-monospace user-select-all'>
                      {randomText}
                    </p>
                  </div>
                </div>

                <div className='pt-3 border-top'>
                  <p className='text-muted mb-3'>
                    댓글을 작성하셨나요? 아래에 인증 코드를 다시 입력해주세요.
                  </p>
                  <div className='input-group mb-3'>
                    <input
                      type='text'
                      className='form-control'
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder='인증 코드 입력'
                      disabled={isLoading}
                    />
                    <button
                      className='btn btn-success'
                      onClick={handleVerifyCode}
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
                        "확인"
                      )}
                    </button>
                  </div>

                  {errorMessage && (
                    <div className='alert alert-danger mb-3'>
                      {errorMessage}
                    </div>
                  )}

                  <button
                    className='btn btn-link text-decoration-none w-100 text-muted'
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    다시 시작
                  </button>
                </div>
              </div>
            )}

            {isVerified && (
              <div>
                <div className='alert alert-success mb-4'>
                  <h5 className='fw-semibold'>인증이 완료되었습니다!</h5>
                  <p className='mb-0'>
                    인스타그램 계정 {instagramId}가 성공적으로 인증되었습니다.
                  </p>
                </div>
                <button
                  className='btn btn-secondary w-100'
                  onClick={handleReset}
                >
                  다시 인증하기
                </button>
              </div>
            )}

            <div className='mt-4 small text-muted'>
              <p className='mb-1'>
                * 인증 코드 댓글이 확인되지 않는 경우, 잠시 후 다시
                시도해주세요.
              </p>
              <p className='mb-0'>
                * 인증에 문제가 있을 경우 고객센터로 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
