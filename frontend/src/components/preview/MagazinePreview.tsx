import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import Image from "next/image";
import { MagazinePreviewProps, ThemeType } from "@/type/preview";
import { Row } from "antd";
import InstagramVerification from "../InstagramVerification";
import { useInstagramVerification } from "@/hooks/useInstagramVerification";

const MagazinePreview: React.FC<MagazinePreviewProps> = ({
  title,
  images,
  theme,
  style,
}) => {
  const [showVerification, setShowVerification] = useState(false);
  const {
    handleVerificationSuccess,
    isLoading: verificationLoading,
    contextHolder,
  } = useInstagramVerification();

  const onInstagramVerificationSuccess = async (instagramId: string) => {
    const success = await handleVerificationSuccess({
      images,
      instagramId,
      magazineTitle: title,
      analyzedImages: images,
      storyTheme: theme,
      magazineStyle: style,
    });

    try {
      if (success) {
        // 성공 후 추가 작업 (예: 다음 단계로 이동)
        alert("s3및 mongoDB 저장 성공");
        // setShowMagazine(true);
      }
    } catch (err: any) {
      alert(err?.message);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("magazine-container");
    if (!element) return;

    // 실제 구현에서는 html2pdf 라이브러리 사용
    // 타입스크립트에서는 html2pdf 모듈을 import하고 타입 정의가 필요합니다
    console.log("PDF 다운로드 기능 (실제 구현 필요)");
    alert(
      "PDF 다운로드 기능은 실제 구현 시 html2pdf.js 라이브러리를 사용해야 합니다."
    );
  };

  // 테마 설명 매핑
  const themeDescriptions: Record<ThemeType, string> = {
    travel: "특별한 여행 순간을 담은",
    family: "소중한 가족과의 시간을 담은",
    food: "맛있는 순간을 담은",
    nature: "아름다운 자연을 담은",
    city: "도시의 매력을 담은",
    event: "특별한 이벤트를 담은",
    auto: "특별한 순간을 담은",
  };

  // 이미지 분석을 기반으로 스토리 설명 생성
  const generateStoryDescription = (imageIndex: number): string => {
    if (images.length <= imageIndex) return "";

    return images[imageIndex].storyText;
  };

  return (
    <div className='mt-5'>
      <h2 className='text-center mb-4'>매거진 미리보기</h2>

      <div id='magazine-container' className={`magazine-container ${style}`}>
        {/* 표지 페이지 */}
        <div className={`magazine-page cover-page ${style}`}>
          <h1 className='magazine-title'>{title || "나의 스토리"}</h1>
          <p className='magazine-subtitle'>{themeDescriptions[theme]} 스토리</p>

          {images.length > 0 && (
            <div className='cover-image-container'>
              <Image
                src={images[0].dataUrl}
                alt='Cover'
                className='cover-image'
                width={500}
                height={500}
              />
            </div>
          )}
        </div>

        {/* 내용 페이지들 */}
        {images.map((image, index) => (
          <>
            <Card
              key={index}
              className={`magazine-page content-page ${style} mb-4`}
            >
              <Card.Body>
                <div className='page-content'>
                  <h3 className='page-title'>
                    {index === 0
                      ? "스토리의 시작"
                      : index === images.length - 1
                      ? "스토리의 마무리"
                      : `순간 ${index}`}
                  </h3>

                  <div className='image-container'>
                    <Image
                      src={image.dataUrl}
                      alt={`Story image ${index + 1}`}
                      className='story-image'
                      width={500}
                      height={500}
                    />
                  </div>

                  <p className='image-caption'>
                    {generateStoryDescription(index)}
                  </p>
                  <div className='tags-container'>
                    {image.analysis.labels.map((label, idx) => (
                      <span key={idx} className='tag'>
                        {label.description}
                      </span>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </>
        ))}
      </div>
      {images.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              gap: 30,
            }}
          >
            <div>
              <Button variant='success' onClick={downloadPDF}>
                매거진 PDF로 다운로드
              </Button>
            </div>
            <div>
              <Button
                variant='primary'
                onClick={() => setShowVerification(!showVerification)}
                disabled={verificationLoading || images.length === 0}
              >
                홈페이지에 저장하기
              </Button>
            </div>
          </div>
        </>
      )}
      {showVerification && (
        <div className='verification-dropdown' style={{ paddingTop: 30 }}>
          <InstagramVerification
            onVerificationSuccess={onInstagramVerificationSuccess}
            disabled={verificationLoading || images.length === 0}
          />
        </div>
      )}
    </div>
  );
};

export default MagazinePreview;
