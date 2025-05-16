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
      >
        {userData?.length &&
          userData
            ?.filter((el) => el.status === "approved")
            .map((el) => (
              <SwiperSlide>
                <img src={`${el?.imageUrls[0]}`} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
