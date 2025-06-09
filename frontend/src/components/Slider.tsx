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
        const listResponse = await axios.get(
          `/api/main/list?${filterValue}=${searchValue}`
        );
        setUserData(listResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filterValue, searchValue]);

  return (
    <div className='top-list'>
      <Swiper
        scrollbar={{
          hide: true,
        }}
        modules={[Scrollbar]}
        spaceBetween={20}
        slidesPerView={5}
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
