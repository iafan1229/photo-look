import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Divider } from "antd";
import { ThemeType } from "@/type/preview";
import Icon, { CloseOutlined } from "@ant-design/icons";
import { calc } from "antd/es/theme/internal";
import { UserData as User } from "@/type/user";
import { extractTitleAndContent } from "@/util/common";
import Masonry from "react-masonry-css";
import html2pdf from "html2pdf.js";
import { applyPDFStyles, removePDFStyles } from "@/type/pdf";

export default function PhotoList({
  filterValue,
  searchValue,
}: {
  filterValue: string | undefined;
  searchValue: string;
}) {
  const [userData, setUserData] = useState<User[]>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUserData, setDetailUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listResponse = await axios.get(
          `/api/main/list?${filterValue}=${searchValue}`
        );

        console.log("List Data:", listResponse);
        setUserData(listResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filterValue, searchValue]);

  const handleDetail = (el: User) => {
    setDetailOpen(!detailOpen);
    setDetailUserData(el);
  };

  // 반응형 브레이크포인트 설정
  const breakpointColumnsObj = {
    default: 4, // 기본 4열
    1100: 3, // 1100px 이하에서 3열
    700: 2, // 700px 이하에서 2열
    500: 1, // 500px 이하에서 1열
  };

  // PDF 미리보기 기능 (새 탭에서 열기)
  const previewPDF = () => {
    const element = document.getElementById("photo-detail-album");
    if (!element) {
      console.error("PDF로 변환할 요소를 찾을 수 없습니다.");
      return;
    }

    // PDF 생성 전 스타일 강제 적용
    applyPDFStyles(element);

    // 이미지 로딩 대기
    const images = element.querySelectorAll("img");
    const imagePromises = Array.from(images).map((img: Element) => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.complete) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        imgElement.onload = resolve;
        imgElement.onerror = resolve;
      });
    });

    Promise.all(imagePromises).then(() => {
      const A4_WIDTH_PX = 794;
      const A4_HEIGHT_PX = 1123;

      const options = {
        margin: [10, 10, 10, 10],
        filename: "photo-album-preview.pdf",
        image: {
          type: "jpeg",
          quality: 0.92,
        },
        html2canvas: {
          scale: 1.2,
          useCORS: true,
          allowTaint: true,
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          windowWidth: A4_WIDTH_PX,
          backgroundColor: "#ffffff",
          logging: false,
          imageTimeout: 15000,
          removeContainer: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      // PDF 생성 후 새 탭에서 미리보기
      html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .get("pdf")
        .then((pdf) => {
          // 새 탭에서 PDF 열기
          window.open(pdf.output("bloburl"), "_blank");
          console.log("PDF 미리보기가 새 탭에서 열렸습니다.");
          // 스타일 원복
          removePDFStyles(element);
        })
        .catch((error) => {
          console.error("PDF 미리보기 중 오류가 발생했습니다:", error);
          alert("PDF 미리보기 중 오류가 발생했습니다. 다시 시도해주세요.");
          removePDFStyles(element);
        });
    });
  };

  // PDF 다운로드 기능 (html2pdf.js 사용)
  const downloadPDF = () => {
    const element = document.getElementById("photo-detail-album");
    if (!element) {
      console.error("PDF로 변환할 요소를 찾을 수 없습니다.");
      return;
    }

    // PDF 생성 전 스타일 강제 적용 (SCSS 문제 해결)
    applyPDFStyles(element);

    // 이미지 로딩 대기
    const images = element.querySelectorAll("img");
    const imagePromises = Array.from(images).map((img: Element) => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.complete) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        imgElement.onload = resolve;
        imgElement.onerror = resolve; // 에러 시에도 진행
      });
    });

    Promise.all(imagePromises).then(() => {
      // A4 크기 고정 옵션 설정
      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;
      const A4_WIDTH_PX = A4_WIDTH_MM * 3.78; // 794px
      const A4_HEIGHT_PX = A4_HEIGHT_MM * 3.78; // 1123px

      const options = {
        margin: [10, 10, 10, 10], // 여백 (mm)
        filename: "photo-album.pdf", // 파일명
        image: {
          type: "jpeg",
          quality: 0.92, // 이미지 품질 조정
        },
        html2canvas: {
          scale: 1.2, // 스케일 약간 증가 (해상도 개선)
          useCORS: true, // CORS 이슈 해결
          allowTaint: true, // 외부 이미지 허용
          width: A4_WIDTH_PX, // A4 너비로 고정 (794px)
          height: A4_HEIGHT_PX, // A4 높이로 고정 (1123px)
          windowWidth: A4_WIDTH_PX, // 윈도우 너비
          backgroundColor: "#ffffff", // 배경색
          logging: false, // 로깅 비활성화
          imageTimeout: 15000, // 이미지 타임아웃 15초
          removeContainer: true, // 컨테이너 제거로 성능 향상
        },
        jsPDF: {
          unit: "mm", // 단위
          format: "a4", // A4 크기
          orientation: "portrait", // 세로 방향
        },
      };

      // PDF 생성 및 다운로드
      html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
          console.log("PDF 다운로드가 완료되었습니다.");
          // 스타일 원복
          removePDFStyles(element);
        })
        .catch((error) => {
          console.error("PDF 생성 중 오류가 발생했습니다:", error);
          alert("PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
          // 스타일 원복
          removePDFStyles(element);
        });
    });
  };

  // HTML 미리보기 모드 (CSS 개발자 도구로 확인 가능)
  const previewHTMLForPDF = () => {
    const element = document.getElementById("photo-detail-album");
    if (!element) {
      console.error("미리보기할 요소를 찾을 수 없습니다.");
      return;
    }

    // PDF용 스타일 적용
    applyPDFStyles(element);

    // 미리보기 모드 클래스 추가
    element.classList.add("pdf-preview-mode");

    // A4 크기로 페이지 스타일 조정
    const A4_WIDTH_PX = 794;
    const originalStyle = document.body.style.cssText;

    document.body.style.cssText = `
    margin: 0;
    padding: 20px;
    background-color: #gray;
    font-family: Arial, sans-serif;
  `;

    // A4 크기 시뮬레이션을 위한 컨테이너 스타일
    element.style.cssText += `
    width: ${A4_WIDTH_PX}px;
    min-height: 1123px;
    background-color: white;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    position: relative;
  `;

    // 미리보기 종료 버튼 추가
    const exitButton = document.createElement("button");
    exitButton.innerHTML = "❌ 미리보기 종료";
    exitButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #ff4444;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 9999;
    font-size: 14px;
    font-weight: bold;
  `;

    exitButton.onclick = () => {
      // 미리보기 모드 종료
      element.classList.remove("pdf-preview-mode");
      removePDFStyles(element);
      document.body.style.cssText = originalStyle;
      exitButton.remove();
      console.log("미리보기 모드를 종료했습니다.");
    };

    document.body.appendChild(exitButton);

    console.log("🎯 미리보기 모드 활성화!");
    console.log(
      "📖 개발자 도구를 열어서 .album-container, .polaroid 등의 CSS를 확인하세요."
    );
    console.log("🔧 스타일을 실시간으로 수정하여 테스트할 수 있습니다.");
    console.log("❌ 우측 상단 버튼을 클릭하여 미리보기를 종료하세요.");
  };

  return (
    <>
      {userData?.length && (
        <section>
          <div className='title'>
            <h1>Albums</h1>
          </div>
          <div className='list photos'>
            <div>
              <div
                className='masonry-wrap'
                style={{ display: "flex", flexWrap: "wrap", gap: 30 }}
              >
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className='my-masonry-grid'
                  columnClassName='my-masonry-grid_column'
                >
                  {userData
                    ?.filter((el) => el.status === "approved")
                    .map((el: User) => (
                      <div
                        key={Math.random().toString()}
                        className='photo-wrap'
                        onClick={() => handleDetail(el)}
                        style={{ flexBasis: "calc(100%/3 - 30px)" }}
                      >
                        <div className='photo'>
                          <Image
                            src={el?.imageUrls?.[0]}
                            alt=''
                            width={500}
                            height={500}
                          />
                        </div>
                        <div className='text'>
                          <div className='des'>{el?.magazine?.title}</div>
                        </div>
                      </div>
                    ))}
                </Masonry>
              </div>
            </div>
          </div>
        </section>
      )}

      {detailOpen && (
        <div className='photo-detail'>
          <div className='close-button' onClick={() => setDetailOpen(false)}>
            <CloseOutlined />
          </div>

          <div
            id='photo-detail-album'
            className='album-container'
            style={{
              backgroundColor: "#f2efe4",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              borderRadius: "10px",
            }}
          >
            {/* 포토카드 표지 */}
            <div
              className='album-cover'
              style={{
                marginBottom: "30px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className='album-cover-inner'>
                <h1>{detailUserData?.magazine.title || "나의 포토카드"}</h1>
                <div className='album-subtitle'>
                  {
                    extractTitleAndContent(
                      detailUserData?.magazine.analyzedImages?.[0]?.storyText
                    ).theme
                  }
                </div>
                <div className='date'>
                  <p style={{ paddingBottom: 10 }}>
                    {new Date(
                      detailUserData?.magazine.createdAt || Date.now()
                    ).toLocaleDateString()}
                    일에 생성된 포토카드 입니다
                  </p>

                  <p>
                    Instagram :{" "}
                    {detailUserData?.personalInfo?.snsId
                      ? "@" + detailUserData?.personalInfo?.snsId
                      : "미입력"}
                  </p>
                </div>
                <Divider style={{ height: 3 }} />
                <h1>목차</h1>
                {detailUserData?.imageUrls &&
                  detailUserData.imageUrls.length > 0 && (
                    <div className='cover-photo-wrapper'>
                      <div className='cover-photo-container'>
                        <div>
                          <Image
                            src={detailUserData.imageUrls[0]}
                            alt='Cover'
                            width={500}
                            height={500}
                          />
                        </div>
                      </div>
                      <div className='cover-photo-title'>
                        {detailUserData.magazine.analyzedImages.map((el) => (
                          <p>- {extractTitleAndContent(el.storyText).title}</p>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* 포토카드 내용 - 폴라로이드 형태의 사진들 */}
            <div className='album-pages'>
              {detailUserData?.imageUrls?.map((image, index) => (
                <div key={index} className='polaroid'>
                  <div className='photo-container'>
                    <Image
                      src={image}
                      alt={`Album image ${index + 1}`}
                      width={500}
                      height={500}
                    />
                  </div>

                  <div className='photo-title'>
                    {
                      extractTitleAndContent(
                        detailUserData.magazine.analyzedImages[index]?.storyText
                      ).title
                    }
                  </div>

                  {detailUserData?.magazine?.analyzedImages?.length > 0 &&
                    detailUserData?.magazine?.analyzedImages?.[index]
                      ?.storyText && (
                      <div className='photo-description'>
                        {
                          extractTitleAndContent(
                            detailUserData.magazine.analyzedImages[index]
                              ?.storyText
                          ).content
                        }
                      </div>
                    )}

                  {detailUserData.magazine?.analyzedImages?.[index]?.analysis
                    ?.labels?.length > 0 && (
                    <div className='photo-tags'>
                      {detailUserData.magazine.analyzedImages[
                        index
                      ].analysis.labels
                        .slice(0, 2)
                        .map((label: any, idx: number) => (
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

          <div className='album-buttons'>
            <Button
              type='primary'
              onClick={downloadPDF}
              style={{
                backgroundColor: "#D9BC8C",
                borderColor: "#B29B72",
                color: "#35281E",
                fontWeight: "bold",
              }}
            >
              포토카드 PDF로 다운로드
            </Button>
            <button onClick={previewPDF}>PDF 미리보기</button>
            <button onClick={previewHTMLForPDF}>
              🔍 HTML 미리보기 (CSS 확인용)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
