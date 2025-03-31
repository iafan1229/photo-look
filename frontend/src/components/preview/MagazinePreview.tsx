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
    const element = document.getElementById("album-container");
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

  // 랜덤 회전 각도 생성 (폴라로이드 효과)
  const getRandomRotation = () => {
    return Math.random() * 6 - 3; // -3도 ~ +3도 사이의 랜덤 각도
  };

  return (
    <div className='mt-5'>
      <h2
        className='text-center mb-4'
        style={{
          fontFamily: "serif",
          color: "#35281E",
          position: "relative",
          display: "inline-block",
          padding: "0 20px",
          margin: "0 auto 25px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <span
          style={{
            position: "relative",
            zIndex: "2",
            background: "linear-gradient(transparent 60%, #D9BC8C 40%)",
            padding: "0 10px",
          }}
        >
          나의 소중한 앨범
        </span>
      </h2>

      <div
        id='album-container'
        className='album-container'
        style={{
          backgroundColor: "#f2efe4",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          maxWidth: "900px",
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 앨범 표지 */}
        <div
          className='album-cover'
          style={{
            backgroundColor: "#35281E",
            padding: "20px",
            borderRadius: "5px",
            marginBottom: "30px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/leather.png")',
            position: "relative",
            color: "#E8D0A9",
          }}
        >
          <div
            style={{
              border: "2px solid #B29B72",
              borderRadius: "3px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: "28px",
                marginBottom: "10px",
                fontFamily: "serif",
                textAlign: "center",
              }}
            >
              {title || "나의 앨범"}
            </h1>

            <div
              style={{
                marginBottom: "15px",
                textAlign: "center",
                fontSize: "16px",
                color: "#D9BC8C",
              }}
            >
              {themeDescriptions[theme]} 이야기
            </div>

            {images.length > 0 && (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#FFF",
                  width: "80%",
                  maxWidth: "300px",
                  boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
                  transform: "rotate(-2deg)",
                  margin: "10px 0 15px",
                }}
              >
                <Image
                  src={images[0].dataUrl}
                  alt='Cover'
                  className='polaroid-image'
                  width={500}
                  height={500}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 앨범 내용 - 폴라로이드 형태의 사진들 */}
        <div
          className='album-pages'
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "60px",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className='polaroid'
              style={{
                backgroundColor: "white",
                padding: "15px 15px 40px 15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                width: "calc(50% - 30px)",
                maxWidth: "350px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div style={{ marginBottom: "12px", overflow: "hidden" }}>
                <Image
                  src={image.dataUrl}
                  alt={`Album image ${index + 1}`}
                  width={500}
                  height={500}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  fontFamily: "cursive, sans-serif",
                  position: "absolute",
                  bottom: "12px",
                  width: "calc(100% - 30px)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {index === 0
                  ? "스토리의 시작"
                  : index === images.length - 1
                  ? "스토리의 마무리"
                  : `순간 ${index}`}
              </div>

              {generateStoryDescription(index) && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-25px",
                    left: "10px",
                    background: "#fffbe0",
                    padding: "5px 10px",
                    fontSize: "12px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    maxWidth: "calc(100% - 20px)",
                    zIndex: 1,
                  }}
                >
                  {generateStoryDescription(index)}
                </div>
              )}

              {image.analysis.labels.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "10px",
                    display: "flex",
                    gap: "5px",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    maxWidth: "calc(100% - 20px)",
                  }}
                >
                  {image.analysis.labels.slice(0, 2).map((label, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: "#6a4c3b",
                        color: "white",
                        padding: "3px 8px",
                        borderRadius: "10px",
                        fontSize: "10px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
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
          <div>
            <div
              style={{
                marginTop: 30,
                display: "flex",
                justifyContent: "center",
                gap: 20,
                padding: "10px",
              }}
            >
              <Button
                variant='light'
                onClick={downloadPDF}
                style={{
                  minWidth: "180px",
                  backgroundColor: "#D9BC8C",
                  borderColor: "#B29B72",
                  color: "#35281E",
                  fontWeight: "bold",
                }}
              >
                앨범 PDF로 다운로드
              </Button>
              <Button
                variant='light'
                onClick={() => setShowVerification(!showVerification)}
                disabled={verificationLoading || images.length === 0}
                style={{
                  minWidth: "180px",
                  backgroundColor: "#D9BC8C",
                  borderColor: "#B29B72",
                  color: "#35281E",
                  fontWeight: "bold",
                }}
              >
                홈페이지에 저장하기
              </Button>
            </div>
          </div>

          {showVerification && (
            <div
              className='verification-dropdown'
              style={{
                paddingTop: 30,
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              <InstagramVerification
                onVerificationSuccess={onInstagramVerificationSuccess}
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
