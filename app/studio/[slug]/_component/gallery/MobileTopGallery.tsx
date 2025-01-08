import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { ArrowBigRight, ArrowBigLeft } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import GalleryImage from "./GalleryImage";
import { Button } from "@/components/ui/button";

interface Props {
  openListModal: () => void;
  images: string[];
}

const MobileTopGallery = ({ openListModal, images }: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <>
      <Swiper
        loop={true}
        onSwiper={(swiper: any) => (swiperRef.current = swiper)}
        slidesPerView={1}
        pagination={true}
        modules={[FreeMode, Pagination]}
        className="h-[80%] w-full"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <GalleryImage
              hoverEffect={false}
              imageUrl={image}
              onClick={openListModal}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Swiper Buttons */}
      <div className="flex space-x-3 mb-4 mx-5 my-3">
        <Button
          onClick={() => swiperRef.current?.slidePrev()}
          className="rounded-full"
        >
          <ArrowBigLeft />
        </Button>
        <Button
          onClick={() => swiperRef.current?.slidePrev()}
          className="rounded-full "
        >
          <ArrowBigRight />
        </Button>
      </div>
    </>
  );
};

export default MobileTopGallery;
