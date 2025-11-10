import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import customer from '../../assets/customer-top.png'

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { reviewsData } from "./reviewsData";
import ReviewCard from "./ReviewCard";


const ReviewSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="w-2xs h-24 mx-auto mb-10">
            <img className="w-full h-full" src={customer} alt="" />
        </div>
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl text-secondary font-bold">
          What our customers are saying
        </h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro.
          Achieve proper alignment and reduce pain with ease!
        </p>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {reviewsData.map((item) => (
          <SwiperSlide key={item.id}>
            <ReviewCard {...item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewSection;
