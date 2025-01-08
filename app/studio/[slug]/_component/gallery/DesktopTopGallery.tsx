import React from "react";
import GalleryImage from "./GalleryImage";

interface Props {
  openListModal: () => void;
}

const DesktopTopGallery = ({ openListModal }: Props) => {
  return (
    <div className="hidden sm:grid grid-cols-2 gap-2 rounded-md overflow-hidden">
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
  );
};

export default DesktopTopGallery;
