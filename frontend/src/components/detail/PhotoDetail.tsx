import { Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { FetchUser } from "@/type/user";
import { extractTitleAndContent } from "@/util/common";

interface PhotoDetailProps {
  isOpen: boolean;
  onClose: () => void;
  userData: FetchUser | null;
}

export default function PhotoDetail({
  isOpen,
  onClose,
  userData,
}: PhotoDetailProps) {
  if (!isOpen || !userData) return null;

  return (
    <div className="photo-detail">
      <div className="close-button" onClick={onClose}>
        <CloseOutlined />
      </div>

      <div
        id="photo-detail-album"
        className="album-container"
        style={{
          backgroundColor: "#f2efe4",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
        }}
      >
        <div
          className="album-cover"
          style={{
            marginBottom: "30px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="album-cover-inner">
            <h1>{userData?.magazine.title || "나의 포토카드"}</h1>
            <div className="album-subtitle">
              {
                extractTitleAndContent(
                  userData?.magazine.analyzedImages?.[0]?.storyText
                ).theme
              }
            </div>
            <div className="date">
              <p style={{ paddingBottom: 10 }}>
                {new Date(
                  userData?.magazine.createdAt || Date.now()
                ).toLocaleDateString()}
                일에 생성된 포토카드 입니다
              </p>

              <p style={{ paddingBottom: "10px 0" }}>
                이름 : {userData?.name ? userData?.name : "미입력"}
              </p>
              <p style={{ paddingTop: 5 }}>
                {userData?.snsId ? "Instagram : @" + userData?.snsId : ""}
              </p>
            </div>
            <Divider style={{ height: 3 }} />
            <h1>목차</h1>
            {userData?.imageUrls && userData.imageUrls.length > 0 && (
              <div className="cover-photo-wrapper">
                <div className="cover-photo-container">
                  <div>
                    <img
                      src={userData.imageUrls[0]}
                      alt="Cover"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
                <div className="cover-photo-title">
                  {userData.magazine.analyzedImages.map((el, index) => (
                    <p key={index}>
                      - {extractTitleAndContent(el.storyText).photoTitle}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="album-pages">
          {userData?.imageUrls?.map((image, index) => (
            <div key={index} className="polaroid">
              <div className="photo-container">
                <img
                  src={image}
                  alt={`Album image ${index + 1}`}
                  width={500}
                  height={500}
                />
              </div>

              <div className="photo-title">
                {
                  extractTitleAndContent(
                    userData.magazine.analyzedImages[index]?.storyText
                  ).photoTitle
                }
              </div>

              {userData?.magazine?.analyzedImages?.length > 0 &&
                userData?.magazine?.analyzedImages?.[index]?.storyText && (
                  <div className="photo-description">
                    {
                      extractTitleAndContent(
                        userData.magazine.analyzedImages[index]?.storyText
                      ).photoContent
                    }
                  </div>
                )}

              {userData?.magazine?.analyzedImages?.[index]?.labels?.length >
                0 && (
                <div className="photo-tags">
                  {userData.magazine.analyzedImages[index].labels
                    .slice(0, 3)
                    .map((label: any, idx: number) => (
                      <span key={idx} className="tag">
                        {label.description}
                      </span>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}