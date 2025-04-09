import Image from "next/image";
import Masonry from "react-responsive-masonry";
import ResponsiveMasonry from "react-responsive-masonry";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Divider } from "antd";
import { User } from "@/type/user";
import { ThemeType } from "@/type/preview";
import Icon, { CloseOutlined } from "@ant-design/icons";

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
  const themeDescriptions: Record<ThemeType, string> = {
    travel: "특별한 여행 순간을 담은",
    family: "소중한 가족과의 시간을 담은",
    food: "맛있는 순간을 담은",
    nature: "아름다운 자연을 담은",
    city: "도시의 매력을 담은",
    event: "특별한 이벤트를 담은",
    auto: "특별한 순간을 담은",
  };

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
                {userData.map((el: User) => (
                  <div
                    key={Math.random().toString()}
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

          <Card
            id='photo-detail-album'
            className='album-container'
            bordered={false}
            style={{
              backgroundColor: "#f2efe4",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              borderRadius: "10px",
            }}
          >
            {/* 앨범 표지 */}
            <Card
              className='album-cover'
              bordered={false}
              style={{
                backgroundColor: "#35281E",
                backgroundImage:
                  'url("https://www.transparenttextures.com/patterns/subtle-dark-vertical.png")',
                marginBottom: "30px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className='album-cover-inner'>
                <h1>{detailUserData?.title || "나의 앨범"}</h1>
                <p>
                  {new Date(
                    detailUserData?.createdAt || Date.now()
                  ).toLocaleDateString()}
                  일에 생성된 앨범
                </p>
                <p>Instagram : @{detailUserData?.instagramId}</p>
                <Divider />
                <div className='album-subtitle'>
                  {detailUserData?.theme
                    ? themeDescriptions[detailUserData.theme as ThemeType]
                    : themeDescriptions.auto}{" "}
                  이야기
                </div>

                {detailUserData?.imageUrls &&
                  detailUserData.imageUrls.length > 0 && (
                    <div className='cover-photo-container'>
                      <Image
                        src={detailUserData.imageUrls[0]}
                        alt='Cover'
                        width={500}
                        height={500}
                      />
                    </div>
                  )}
              </div>
            </Card>

            {/* 앨범 내용 - 폴라로이드 형태의 사진들 */}
            <div className='album-pages'>
              {detailUserData?.imageUrls?.map((image, index) => (
                <Card
                  key={index}
                  className='polaroid'
                  bordered={false}
                  style={{
                    padding: 0,
                    backgroundColor: "white",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <div className='photo-container'>
                    <Image
                      src={image}
                      alt={`Album image ${index + 1}`}
                      width={500}
                      height={500}
                    />
                  </div>

                  <div className='photo-title'>
                    {index === 0
                      ? "스토리의 시작"
                      : index === detailUserData.imageUrls.length - 1
                      ? "스토리의 마무리"
                      : `순간 ${index}`}
                  </div>

                  {detailUserData?.magazine?.analyzedImages?.length > 0 &&
                    detailUserData?.magazine?.analyzedImages?.[index]
                      ?.storyText && (
                      <div className='photo-description'>
                        {
                          detailUserData.magazine.analyzedImages[index]
                            .storyText
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
                </Card>
              ))}
            </div>
          </Card>

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
              앨범 PDF로 다운로드
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
