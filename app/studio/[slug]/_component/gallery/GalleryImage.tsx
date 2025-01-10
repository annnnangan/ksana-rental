import React from "react";
import Image from "next/image";

interface Props {
  onClick?: () => void;
  objectFit?: string;
  hoverEffect?: boolean;
  imageUrl: string;
}

const GalleryImage = ({
  onClick,
  objectFit = "object-cover",
  hoverEffect = true,
  imageUrl,
}: Props) => {
  return (
    <div className="relative aspect-video group w-full h-full">
      <button type="button">
        <Image
          src={imageUrl}
          alt="images"
          fill
          sizes="(min-width: 1540px) 724px, (min-width: 1280px) 596px, (min-width: 1040px) 468px, (min-width: 780px) 340px, 276px"
          className={`${objectFit} object-center ${
            hoverEffect &&
            "transition-all duration-500 group-hover:brightness-50"
          }`}
          onClick={onClick}
        />
      </button>
    </div>
  );
};

export default GalleryImage;
