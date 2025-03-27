// pages/instagram-verification.js
import React, { useState } from "react";
import { Form, Input, Button, Alert, Space } from "antd";
import axios from "axios";
import Head from "next/head";

interface InstagramVerificationProps {
  onVerificationSuccess: (instagramId: string) => void;
  disabled?: boolean;
}

const InstagramVerification: React.FC<InstagramVerificationProps> = ({
  onVerificationSuccess,
  disabled = false,
}) => {
  const [instagramId, setInstagramId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerification = async () => {
    if (!instagramId.trim()) {
      setError("인스타그램 아이디를 입력해주세요.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await axios.get("/front/api/verify-comment", {
        params: {
          verification_code: instagramId,
        },
      });

      if (response.data.status === "success") {
        onVerificationSuccess(instagramId);
      } else {
        setError("인증에 실패했습니다. 댓글을 확인해주세요.");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "인증 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className='instagram-verification-container'>
      <h2>인스타그램 계정 인증</h2>

      <div className='verification-instructions'>
        <Alert
          type='info'
          message='인증 방법'
          description={
            <ol>
              <li>@daily_9230 계정을 팔로우해주세요.</li>
              <li>
                <a
                  href='https://www.instagram.com/p/DHp8515SJec'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  이 게시물
                </a>
                에 본인의 인스타그램 계정으로 댓글을 작성해주세요.
              </li>
              <li>
                아래에 본인의 인스타그램 아이디를 입력하고 인증하기 버튼을
                클릭해주세요.
              </li>
            </ol>
          }
          className='mb-4'
        />
      </div>

      <Form layout='vertical'>
        <Form.Item
          label='인스타그램 아이디'
          validateStatus={error ? "error" : ""}
          help={error}
        >
          <Space>
            <Input
              value={instagramId}
              onChange={(e) => setInstagramId(e.target.value)}
              placeholder='인스타그램 아이디 입력'
              disabled={isVerifying || disabled}
            />
            <Button
              type='primary'
              onClick={handleVerification}
              loading={isVerifying}
              disabled={disabled || !instagramId.trim()}
            >
              인증하기
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <div className='verification-notes' style={{ marginTop: "1rem" }}>
        <small className='text-muted'>
          * 인증이 확인되지 않는 경우, 잠시 후 다시 시도해주세요.저장 버튼
          누를시에 s3에 이미지 저장 후 - mongoDB에 앨범데이터 저장
          <br />* 인증에 문제가 있을 경우 고객센터로 문의해주세요.
        </small>
      </div>
    </div>
  );
};

export default InstagramVerification;
