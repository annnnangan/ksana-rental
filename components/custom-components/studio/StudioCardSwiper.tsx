"use client";
import { useRef } from "react";
// Import Swiper React components
import { ArrowBigLeft, ArrowBigRight, ThumbsUp } from "lucide-react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Button } from "@/components/shadcn/button";
import { FreeMode, Pagination } from "swiper/modules";
import StudioCard from "./StudioCard";
import { studioCardInfo } from "./StudioList";

interface Props {
  slideItems: studioCardInfo[];
}

const StudioCardSwiper = ({ slideItems }: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <>
      {/* Swiper Buttons */}
      <div className="flex space-x-1 mb-2 justify-end">
        <Button
          onClick={() => swiperRef.current?.slidePrev()}
          className="rounded-full p-0 h-5 w-5"
        >
          <ArrowBigLeft />
        </Button>
        <Button
          onClick={() => swiperRef.current?.slideNext()}
          className="rounded-full p-0 h-5 w-5 "
        >
          <ArrowBigRight />
        </Button>
      </div>

      <Swiper
        loop={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[FreeMode, Pagination]}
        spaceBetween={10}
        className="h-full"
        breakpoints={{
          320: { slidesPerView: 2.2 }, // Mobile (small screens)
          640: { slidesPerView: 2.2 }, // Tablets
          1024: { slidesPerView: 3.2 }, // Desktops
        }}
      >
        {slideItems.map((item) => (
          <SwiperSlide key={item.slug}>
            <StudioCard studio={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default StudioCardSwiper;
