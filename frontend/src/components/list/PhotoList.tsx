import Image from "next/image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useState } from "react";
import axios from "axios";
import { CloseOutlined, CloseSquareFilled } from "@ant-design/icons";
import { Image as AntImage, Card, Button, Row } from "antd";
import { User } from "@/type/user";
import { ThemeType } from "@/type/preview";

export default function PhotoList() {
  const [userData, setUserData] = useState<User[]>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUserData, setDetailUserData] = useState<User | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listResponse] = await Promise.all([
          axios.get("/api/main/list"),
          // axios.get("/api/main/list-slider"),
        ]);

        console.log("List Data:", listResponse);
        setUserData(listResponse.data.data);
        // console.log("Detail Data:", detailResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDetail = (el: User) => {
    setDetailOpen(!detailOpen);
    setDetailUserData(el);
  };

  // 테마 설명 매핑 (MagazinePreview에서 가져옴)
  const themeDescriptions: Record<ThemeType, string> = {
    travel: "특별한 여행 순간을 담은",
    family: "소중한 가족과의 시간을 담은",
    food: "맛있는 순간을 담은",
    nature: "아름다운 자연을 담은",
    city: "도시의 매력을 담은",
    event: "특별한 이벤트를 담은",
    auto: "특별한 순간을 담은",
  };

  // PDF 다운로드 기능 (MagazinePreview에서 가져옴)
  const downloadPDF = () => {
    const element = document.getElementById("photo-detail-container");
    if (!element) return;

    // 실제 구현에서는 html2pdf 라이브러리 사용
    console.log("PDF 다운로드 기능 (실제 구현 필요)");
    alert(
      "PDF 다운로드 기능은 실제 구현 시 html2pdf.js 라이브러리를 사용해야 합니다."
    );
  };

  return (
    <>
      {userData?.length && (
        <section>
          <div className='title'>
            <h1>Albums</h1>
          </div>
          <div className='list photos'>
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 300: 2, 500: 3, 700: 4 }}
            >
              <Masonry gutter='20px' className='masonry-wrap'>
                {userData.map((el: User) => (
                  <>
                    <div
                      className='photo-wrap'
                      onClick={() => handleDetail(el)}
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
                        <div className='des'>{el?.title}</div>
                      </div>
                    </div>
                  </>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </section>
      )}

      {detailOpen && (
        <div className='photo-detail'>
          <h2 className='text-center mb-4'>매거진 미리보기</h2>

          <div
            id='photo-detail-container'
            className={`magazine-container ${detailUserData?.style || ""}`}
          >
            {/* 내용 페이지들 */}
            <Card
              className={`magazine-page content-page ${
                detailUserData?.style || ""
              } mb-4`}
              style={{
                maxHeight: "90vh",
                overflowY: "auto",
                background: "white",
              }}
            >
              {/* 표지 페이지 */}
              <div
                className={`magazine-page cover-page ${
                  detailUserData?.style || ""
                }`}
              >
                <h1 className='magazine-title'>
                  {detailUserData?.title || "나의 스토리"}
                </h1>
                <p className='magazine-subtitle'>
                  {detailUserData?.theme
                    ? themeDescriptions[detailUserData.theme as ThemeType]
                    : themeDescriptions.auto}{" "}
                  스토리
                </p>

                <div
                  className='creator-info'
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    margin: "10px 0",
                    fontSize: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>인스타그램:</span>
                    <span>@{detailUserData?.instagramId || "unknown"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>작성일:</span>
                    <span>
                      {detailUserData?.createdAt
                        ? new Date(detailUserData.createdAt).toLocaleDateString(
                            "ko-KR"
                          )
                        : "날짜 정보 없음"}
                    </span>
                  </div>
                </div>

                {detailUserData?.imageUrls &&
                  detailUserData.imageUrls.length > 0 && (
                    <div className='cover-image-container'>
                      <Image
                        src={detailUserData.imageUrls[0]}
                        alt='Cover'
                        className='cover-image'
                        width={500}
                        height={500}
                      />
                    </div>
                  )}
              </div>

              {detailUserData?.imageUrls.map((image, index) => (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                      gap: 20,
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  ></div>
                  <div>
                    <div className='page-content'>
                      <h3 className='page-title'>
                        {index === 0
                          ? "스토리의 시작"
                          : index === detailUserData.imageUrls.length - 1
                          ? "스토리의 마무리"
                          : `순간 ${index}`}
                      </h3>

                      <div className='image-container'>
                        <Image
                          src={image}
                          alt={`Story image ${index + 1}`}
                          className='story-image'
                          width={500}
                          height={500}
                        />
                      </div>

                      <p className='image-caption'>
                        {detailUserData.title || ""}
                      </p>
                      <div className='tags-container'>
                        {detailUserData.magazine?.analyzedImages?.[
                          index
                        ]?.analysis?.labels?.map((label: any, idx: number) => (
                          <span key={idx} className='tag'>
                            {label.description}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 15,
                }}
              >
                <Button
                  type='primary'
                  onClick={downloadPDF}
                  style={{ minWidth: "180px" }}
                >
                  매거진 PDF로 다운로드
                </Button>
                <Button
                  type='default'
                  onClick={() => {
                    setDetailOpen(false);
                    setDetailUserData(null);
                  }}
                  style={{ minWidth: "100px" }}
                >
                  닫기
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
