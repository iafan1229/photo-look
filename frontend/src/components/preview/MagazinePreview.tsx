// frontend/src/components/preview/MagazinePreview.tsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Image from "next/image";
import { MagazinePreviewProps, ThemeType } from "@/type/preview";
import PersonalInfoVerification, {
  PersonalInfo,
} from "../PersonalInfoVerification";
import { usePersonalInfoVerification } from "@/hooks/usePersonalInfoVerification";
import { extractTitleAndContent } from "@/util/common";

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
  } = usePersonalInfoVerification();

  const onPersonalInfoVerificationSuccess = async (
    personalInfo: PersonalInfo
  ) => {
    const success = await handleVerificationSuccess({
      images,
      personalInfo,
      magazineTitle: title,
      analyzedImages: images,
      storyTheme: theme,
      magazineStyle: style,
    });

    try {
      if (success) {
        // 성공 후 추가 작업 (예: 다음 단계로 이동)
        alert(
          "인증 요청이 성공적으로 전송되었습니다. 관리자 확인 후 이미지가 등록됩니다."
        );
        setShowVerification(false);
      }
    } catch (err: any) {
      alert(err?.message);
    }
  };

  // const downloadPDF = () => {
  //   const element = document.getElementById("album-container");
  //   if (!element) return;

  //   // 실제 구현에서는 html2pdf 라이브러리 사용
  //   console.log("PDF 다운로드 기능 (실제 구현 필요)");
  //   alert(
  //     "PDF 다운로드 기능은 실제 구현 시 html2pdf.js 라이브러리를 사용해야 합니다."
  //   );
  // };

  // 이미지 분석을 기반으로 스토리 설명 생성
  const generateStoryDescription = (imageIndex: number): string => {
    if (images.length <= imageIndex) return "";
    return images[imageIndex].storyText;
  };

  return (
    <div className='photo-detail preview'>
      {contextHolder} {/* 알림 표시용 */}
      <div id='album-container' className='album-container'>
        {/* 포토카드 표지 */}
        <div className='album-cover'>
          <div className='album-cover-inner'>
            <h1>{title || "나의 포토카드"}</h1>

            <div className='album-subtitle'>
              {extractTitleAndContent(images[0]?.storyText).theme}
            </div>

            {images.length > 0 && (
              <div className='cover-photo-wrapper'>
                <div className='cover-photo-container'>
                  <img
                    src={images[0].dataUrl}
                    alt='Cover'
                    width={500}
                    height={500}
                  />
                </div>
                <div className='cover-photo-title'>
                  {images.map((el) => (
                    <p>- {extractTitleAndContent(el.storyText).photoTitle}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 포토카드 내용 - 폴라로이드 형태의 사진들 */}
        <div className='album-pages'>
          {images.map((image, index) => (
            <div key={index} className='polaroid'>
              <div className='photo-container'>
                <img
                  src={image.dataUrl}
                  alt={`Album image ${index + 1}`}
                  width={500}
                  height={500}
                />
              </div>

              <div className='photo-title'>
                {
                  extractTitleAndContent(generateStoryDescription(index))
                    .photoTitle
                }
              </div>

              {generateStoryDescription(index) && (
                <div className='photo-description'>
                  {
                    extractTitleAndContent(generateStoryDescription(index))
                      .photoContent
                  }
                </div>
              )}

              {image.analysis &&
                image.analysis.labels &&
                image.analysis.labels.length > 0 && (
                  <div className='photo-tags'>
                    {image.analysis.labels.slice(0, 2).map((label, idx) => (
                      <span key={idx} className='tag'>
                        {label.description}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
      {images.length > 0 && (
        <>
          <div className='album-footer'>
            <div className='album-buttons'>
              {/* <Button variant='light' onClick={downloadPDF}>
                포토카드 PDF로 다운로드
              </Button> */}
              <Button
                variant='light'
                onClick={() => setShowVerification(!showVerification)}
                disabled={verificationLoading || images.length === 0}
              >
                홈페이지에 등록 신청하기
              </Button>
            </div>
          </div>

          {showVerification && (
            <div className='verification-dropdown'>
              <PersonalInfoVerification
                onVerificationSuccess={onPersonalInfoVerificationSuccess}
                disabled={verificationLoading || images.length === 0}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MagazinePreview;
