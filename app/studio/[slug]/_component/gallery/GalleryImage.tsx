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
