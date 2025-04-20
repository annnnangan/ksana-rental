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
import StudioMiniCard from "../studio-card/StudioMiniCard";

interface FeatureCardProps {
  name: string;
  slug: string;
  cover_photo: string;
  rating: string;
  district: string;
}

interface Props {
  slideItems: FeatureCardProps[];
}

const FeatureCardSwiper = ({ slideItems }: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <>
      <div className="flex justify-between">
        <p className="text-xs flex items-center gap-1 text-white drop-shadow-xl font-bold">
          <ThumbsUp size={12} />
          推薦場地
        </p>
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
            <StudioMiniCard
              studio_name={item.name}
              studio_slug={item.slug}
              cover_image={item.cover_photo}
              rating={item.rating}
              district={item.district}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default FeatureCardSwiper;
