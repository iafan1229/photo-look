// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";

export default function Slider() {
  return (
    <div className='top-list'>
      <Swiper
        slidesPerView={5}
        spaceBetween={30}
        centeredSlides
        loop
        className='mySwiper'
      >
        {[1, 2, 3, 4, 5, 4, 3, 2, 1, 5].map((el) => (
          <SwiperSlide>
            <img src={`img/${el}.jpg`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
