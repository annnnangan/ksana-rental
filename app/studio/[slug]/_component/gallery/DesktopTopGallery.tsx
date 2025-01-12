import React from "react";
import StudioImage from "../../../../_components/studio/StudioImage";

interface Props {
  openListModal: () => void;
  images: string[];
}

const DesktopTopGallery = ({ openListModal, images }: Props) => {
  return (
    <div className="hidden sm:grid grid-cols-2 gap-2 rounded-md overflow-hidden">
      <StudioImage onClick={openListModal} imageUrl={images[0]} />

      <div className="grid grid-rows-2 gap-2">
        <div className="grid grid-cols-2 gap-2">
          <StudioImage onClick={openListModal} imageUrl={images[1]} />
          <StudioImage onClick={openListModal} imageUrl={images[2]} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StudioImage onClick={openListModal} imageUrl={images[3]} />
          <StudioImage onClick={openListModal} imageUrl={images[4]} />
        </div>
      </div>
    </div>
  );
};

export default DesktopTopGallery;
