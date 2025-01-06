import React from "react";
import GalleryImage from "./GalleryImage";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

const DesktopTopGallery = () => {
  return (
    <section className="relative">
      <div className="hidden md:grid grid-cols-2 gap-2 rounded-md overflow-hidden">
        <GalleryImage />

        <div className="grid grid-rows-2 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <GalleryImage />
            <GalleryImage />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <GalleryImage />
            <GalleryImage />
          </div>
        </div>
      </div>
      <Button className="absolute bottom-0 right-0 mr-2 mb-2 text-[12px]">
        <ImageIcon /> 查看所有圖片
      </Button>
    </section>
  );
};

export default DesktopTopGallery;
