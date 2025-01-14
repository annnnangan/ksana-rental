"use client";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import DesktopTopGallery from "./DesktopTopGallery";
import GalleryListModal from "./GalleryListModal";
import GallerySlideshowModal from "./GallerySlideshowModal";
import MobileTopGallery from "./MobileTopGallery";

interface Props {
  images: string[];
}

const TopGallery = ({ images }: Props) => {
  const [isOpenListModal, setOpenListModal] = useState(false);
  const [isOpenSlideshowModal, setOpenSlideshowModal] = useState(false);

  const openListModal = () => {
    setOpenSlideshowModal(false);
    setOpenListModal(true);
  };

  const closeListModal = () => {
    setOpenListModal(false);
  };

  const openSlideshowModal = () => {
    setOpenListModal(false);
    setOpenSlideshowModal(true);
  };

  const closeSlideshowModal = () => {
    setOpenSlideshowModal(false);
  };

  return (
    <>
      <section className="relative">
        <DesktopTopGallery openListModal={openListModal} images={images} />

        <div className="sm:hidden -mx-2">
          <MobileTopGallery openListModal={openListModal} images={images} />
        </div>

        <Button
          className="absolute bottom-0 right-0 md:mr-2 md:mb-2 mr-5 text-[12px]"
          onClick={openListModal}
        >
          <ImageIcon />{" "}
          <span className="hidden min-[320px]:inline"> 查看所有圖片</span>
        </Button>
      </section>

      <GalleryListModal
        images={images}
        isOpenListModal={isOpenListModal}
        onCloseListModal={closeListModal}
        openSlideshowModal={openSlideshowModal}
      />

      <GallerySlideshowModal
        images={images}
        isOpen={isOpenSlideshowModal}
        onCloseModal={closeSlideshowModal}
        openListModal={openListModal}
      />
    </>
  );
};

export default TopGallery;
