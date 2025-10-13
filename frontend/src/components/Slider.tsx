import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import "swiper/css";
import axios from "axios";
import { UserData } from "@/type/user";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";

export default function Slider({
  filterValue,
  searchValue,
}: {
  filterValue: string | undefined;
  searchValue: string;
}) {
  const [userData, setUserData] = useState<UserData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          limit: "1000", // 충분히 큰 값으로 설정하여 모든 데이터 가져오기
        });
        
        if (filterValue && searchValue) {
          params.append(filterValue, searchValue);
        } else {
          params.append("total", "true");
        }

        const listResponse = await axios.get(
          `/api/main/list?${params.toString()}`
        );
        setUserData(listResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filterValue, searchValue]);

  console.log(userData?.filter((el) => el.status === "approved"));
  return (
    <div className='top-list'>
      <Swiper
        scrollbar={{
          hide: true,
        }}
        modules={[Scrollbar]}
        spaceBetween={20}
        loop
        className='mySwiper'
        breakpoints={{
          370: {
            slidesPerView: 1,
            centeredSlides: true,
            spaceBetween: 10,
          },
          // 큰 모바일 (480px 이상)
          500: {
            slidesPerView: 1.2,
            centeredSlides: true,
          },
          // 태블릿 (768px 이상)
          768: {
            slidesPerView: 2,
          },
          // 데스크톱 (1200px 이상)
          1200: {
            slidesPerView: 5,
          },
        }}
      >
        {userData?.length &&
          userData
            ?.filter((el) => el.status === "approved")
            .map((el, i) => (
              <SwiperSlide key={i}>
                <img src={`${el?.imageUrls[0]}`} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
