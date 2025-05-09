import Image from "next/image";
import Masonry from "react-responsive-masonry";
import ResponsiveMasonry from "react-responsive-masonry";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Divider } from "antd";
import { ThemeType } from "@/type/preview";
import Icon, { CloseOutlined } from "@ant-design/icons";
import { calc } from "antd/es/theme/internal";
import { UserData as User } from "@/type/user";
import { extractTitleAndContent } from "@/util/common";

export default function PhotoList() {
  const [userData, setUserData] = useState<User[]>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUserData, setDetailUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listResponse] = await Promise.all([axios.get("/api/main/list")]);

        console.log("List Data:", listResponse);
        setUserData(listResponse.data.data);
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

  // 테마 설명 매핑

  // PDF 다운로드 기능
  const downloadPDF = () => {
    // const element = document.getElementById("photo-detail-album");
    // if (!element) return;
    // console.log("PDF 다운로드 기능 (실제 구현 필요)");
    // alert(
    //   "PDF 다운로드 기능은 실제 구현 시 html2pdf.js 라이브러리를 사용해야 합니다."
    // );
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
                <div className='date'>
                  <p>
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
          </div>
        </div>
      )}
    </>
  );
}
