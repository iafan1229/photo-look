import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import "swiper/css";
import axios from "axios";
import { User } from "@/type/user";
export default function Slider() {
  const [userData, setUserData] = useState<User[]>([]);
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
  return (
    <div className='top-list'>
      <Swiper
        slidesPerView={5}
        spaceBetween={-15}
        centeredSlides
        loop
        className='mySwiper'
      >
        {userData?.length &&
          userData?.map((el) => (
            <SwiperSlide>
              <img src={`${el?.imageUrls[0]}`} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
