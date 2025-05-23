import { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .thumbnailSwiper .swiper-slide-thumb-active {
    opacity: 1;
  }
`;

// import required modules
import StudioImage from "@/components/custom-components/studio-card/StudioImage";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

interface Props {
  images: string[];
}

const GallerySlideshow = ({ images }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <GlobalStyle />
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="h-[80%] w-full mx-auto bg-black"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <StudioImage objectFit="object-contain" hoverEffect={false} imageUrl={image} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        //@ts-expect-error expected
        onSwiper={setThumbsSwiper}
        loop={true}
        slidesPerView={5}
        spaceBetween={10}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbnailSwiper h-[20%] w-full mx-auto"
      >
        {images.map((image) => (
          <SwiperSlide key={image} className="opacity-[0.4]">
            <StudioImage hoverEffect={false} imageUrl={image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default GallerySlideshow;
