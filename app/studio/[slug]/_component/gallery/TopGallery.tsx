"use client";
import React, { useState } from "react";
import GalleryImage from "./GalleryImage";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import GalleryListModal from "./GalleryListModal";
import GallerySlideshowModal from "./GallerySlideshowModal";
import GallerySlideshow from "./GallerySlideshow";
import MobileTopGallery from "./MobileTopGallery";
import DesktopTopGallery from "./DesktopTopGallery";

const TopGallery = () => {
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
      <section className="relative -mx-5 sm:mx-5">
        <DesktopTopGallery openListModal={openListModal} />

        <div className="sm:hidden">
          <MobileTopGallery openListModal={openListModal} />
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
        isOpenListModal={isOpenListModal}
        onCloseListModal={closeListModal}
        openSlideshowModal={openSlideshowModal}
      />

      <GallerySlideshowModal
        isOpen={isOpenSlideshowModal}
        onCloseModal={closeSlideshowModal}
        openListModal={openListModal}
      />
    </>
  );
};

export default TopGallery;
