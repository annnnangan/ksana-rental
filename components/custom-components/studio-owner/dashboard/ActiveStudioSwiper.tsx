"use client";
import { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
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
import StudioMiniCard from "../../studio/StudioMiniCard";

interface FeatureCardProps {
  name: string;
  slug: string;
  cover_photo: string;
  rating: string;
}

interface Props {
  slideItems: FeatureCardProps[];
}

const ActiveStudioSwiper = ({ slideItems }: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      const checkNavigation = () => {
        setShowNavigation(Number(swiper.slides.length) > Number(swiper.params.slidesPerView));
      };
      swiper.on("slideChange", checkNavigation);
      checkNavigation();
      return () => swiper.off("slideChange", checkNavigation);
    }
  }, [slideItems]);

  return (
    <>
      <div className="flex justify-between">
        {/* Swiper Buttons */}
        {showNavigation && (
          <div className="flex space-x-1 mb-2 justify-end">
            <Button onClick={() => swiperRef.current?.slidePrev()} className="rounded-full p-0 h-5 w-5">
              <ArrowBigLeft />
            </Button>
            <Button onClick={() => swiperRef.current?.slideNext()} className="rounded-full p-0 h-5 w-5 ">
              <ArrowBigRight />
            </Button>
          </div>
        )}
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
          <SwiperSlide key={item.name}>
            <StudioMiniCard studio_name={item.name} studio_slug={item.slug} cover_image={item.cover_photo} rating={item.rating} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ActiveStudioSwiper;
