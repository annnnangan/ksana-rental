import React from "react";
import Image from "next/image";

interface Props {
  onClick?: () => void;
  objectFit?: string;
  hoverEffect?: boolean;
}

const GalleryImage = ({
  onClick,
  objectFit = "object-cover",
  hoverEffect = true,
}: Props) => {
  return (
    <div className="relative aspect-video group w-full h-full">
      <button type="button">
        <Image
          src="https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg"
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
