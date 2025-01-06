"use client";
import React, { useState } from "react";
import GalleryImage from "./GalleryImage";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import GalleryListModal from "./GalleryListModal";

const DesktopTopGallery = () => {
  const [isOpenListModal, setOpenListModal] = useState(false);

  const openListModal = () => {
    setOpenListModal(true);
  };

  const closeListModal = () => {
    setOpenListModal(false);
  };

  return (
    <>
      <section className="relative">
        <div className="hidden md:grid grid-cols-2 gap-2 rounded-md overflow-hidden">
          <GalleryImage onClick={openListModal} />

          <div className="grid grid-rows-2 gap-2">
            <div className="grid grid-cols-2 gap-2">
              <GalleryImage onClick={openListModal} />
              <GalleryImage onClick={openListModal} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <GalleryImage onClick={openListModal} />
              <GalleryImage onClick={openListModal} />
            </div>
          </div>
        </div>
        <Button
          className="absolute bottom-0 right-0 mr-2 mb-2 text-[12px]"
          onClick={openListModal}
        >
          <ImageIcon /> 查看所有圖片
        </Button>
      </section>
      <GalleryListModal
        isOpen={isOpenListModal}
        onCloseModal={closeListModal}
      />
    </>
  );
};

export default DesktopTopGallery;
