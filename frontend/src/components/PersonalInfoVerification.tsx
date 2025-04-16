// frontend/src/components/PersonalInfoVerification.tsx
import React, { useState } from "react";
import { Form, Input, Button, Alert, Space } from "antd";

export interface PersonalInfo {
  name: string;
  email: string;
  phoneNumber: string;
  snsId?: string;
}

interface PersonalInfoVerificationProps {
  onVerificationSuccess: (personalInfo: PersonalInfo) => void;
  disabled?: boolean;
}

const PersonalInfoVerification: React.FC<PersonalInfoVerificationProps> = ({
  onVerificationSuccess,
  disabled = false,
}) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    email: "",
    phoneNumber: "",
    snsId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // 기본 유효성 검사
    if (!personalInfo.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!personalInfo.email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!personalInfo.phoneNumber.trim()) {
      setError("휴대폰 번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 검증 성공 콜백 호출
      onVerificationSuccess(personalInfo);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "처리 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className='personal-info-verification-container'
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>개인정보 입력</h2>

      <div className='verification-instructions'>
        <Alert
          type='info'
          message='인증 안내'
          description={
            <ol>
              <li>아래에 개인정보를 입력해주세요.</li>
              <li>입력하신 정보는 관리자 확인 후 승인됩니다.</li>
              <li>승인 후 홈페이지에 이미지가 등록됩니다.</li>
            </ol>
          }
          className='mb-4'
        />
      </div>

      <Form layout='vertical' style={{ width: "100%" }}>
        <Form.Item label='이름' validateStatus={error ? "error" : ""} required>
          <Input
            name='name'
            value={personalInfo.name}
            onChange={handleChange}
            placeholder='이름 입력'
            disabled={isSubmitting || disabled}
          />
        </Form.Item>

        <Form.Item
          label='이메일'
          validateStatus={error ? "error" : ""}
          required
        >
          <Input
            name='email'
            type='email'
            value={personalInfo.email}
            onChange={handleChange}
            placeholder='이메일 입력'
            disabled={isSubmitting || disabled}
          />
        </Form.Item>

        <Form.Item
          label='휴대폰 번호'
          validateStatus={error ? "error" : ""}
          required
        >
          <Input
            name='phoneNumber'
            value={personalInfo.phoneNumber}
            onChange={handleChange}
            placeholder='휴대폰 번호 입력 (예: 010-1234-5678)'
            disabled={isSubmitting || disabled}
          />
        </Form.Item>

        <Form.Item
          label='SNS 아이디 (선택사항)'
          validateStatus={error ? "error" : ""}
        >
          <Input
            name='snsId'
            value={personalInfo.snsId}
            onChange={handleChange}
            placeholder='SNS 아이디 입력'
            disabled={isSubmitting || disabled}
          />
        </Form.Item>

        {error && (
          <Alert
            type='error'
            message={error}
            style={{ marginBottom: "10px" }}
          />
        )}

        <Button
          type='primary'
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={
            disabled ||
            !personalInfo.name ||
            !personalInfo.email ||
            !personalInfo.phoneNumber
          }
          style={{ width: "100%" }}
        >
          인증 요청하기
        </Button>
      </Form>

      <div className='verification-notes' style={{ marginTop: "1rem" }}>
        <small className='text-muted'>
          개인정보는 홈페이지 이미지 등록을 위해서만 사용되며, 관리자 승인 후
          저장됩니다.
        </small>
      </div>
    </div>
  );
};

export default PersonalInfoVerification;
