import Image from "next/image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/type";
import { CloseOutlined, CloseSquareFilled } from "@ant-design/icons";
import { Image as AntImage } from "antd";

export default function PhotoList() {
  const [userData, setUserData] = useState([]);
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
                        <Image src={el?.upload?.[0]} fill alt='' />
                      </div>
                      <div className='text'>
                        <div className='artist'>Jua</div>
                        <div className='des'>{el?.textarea}</div>
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
        <>
          <div className='photo-detail'>
            <div className='detail-wrap'>
              <span
                className='close'
                onClick={() => {
                  setDetailOpen(!detailOpen);
                  setDetailUserData(null);
                }}
              >
                <CloseOutlined />
              </span>
              <div className='des'>
                <div className='text-wrap'>
                  <h3>
                    <b>이름</b>
                    <p>Jua</p>
                  </h3>
                  <div>
                    <b>날짜</b>
                    <p>
                      {detailUserData?.date?.[0]}
                      {detailUserData?.date?.[1]}
                    </p>
                  </div>
                  <div>
                    <b>인스타그램</b>
                    <p>{detailUserData?.instagramId}</p>
                  </div>
                  <div>
                    <b>소개</b>
                    <p>{detailUserData?.textarea}</p>
                  </div>
                </div>
                <hr />
                <div className='photo-wrap'>
                  {detailUserData?.upload.map((img) => (
                    <div className='photo'>
                      <AntImage src={img} alt='' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
