import React from "react";
import GalleryImage from "./GalleryImage";

interface Props {
  openListModal: () => void;
  images: string[];
}

const DesktopTopGallery = ({ openListModal, images }: Props) => {
  return (
    <div className="hidden sm:grid grid-cols-2 gap-2 rounded-md overflow-hidden">
      <GalleryImage onClick={openListModal} imageUrl={images[0]} />

      <div className="grid grid-rows-2 gap-2">
        <div className="grid grid-cols-2 gap-2">
          <GalleryImage onClick={openListModal} imageUrl={images[1]} />
          <GalleryImage onClick={openListModal} imageUrl={images[2]} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <GalleryImage onClick={openListModal} imageUrl={images[3]} />
          <GalleryImage onClick={openListModal} imageUrl={images[4]} />
        </div>
      </div>
    </div>
  );
};

export default DesktopTopGallery;
