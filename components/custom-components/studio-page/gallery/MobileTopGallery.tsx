import { useRef } from "react";
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
import StudioImage from "@/components/custom-components/studio-card/StudioImage";

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
        className=""
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <StudioImage hoverEffect={false} imageUrl={image} onClick={openListModal} />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Swiper Buttons */}
      <div className="flex space-x-3 mb-4 mx-5 my-3">
        <Button onClick={() => swiperRef.current?.slidePrev()} className="rounded-full">
          <ArrowBigLeft />
        </Button>
        <Button onClick={() => swiperRef.current?.slidePrev()} className="rounded-full ">
          <ArrowBigRight />
        </Button>
      </div>
    </>
  );
};

export default MobileTopGallery;
