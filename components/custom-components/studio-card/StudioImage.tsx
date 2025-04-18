import React from "react";
import Image from "next/image";

interface Props {
  onClick?: () => void;
  objectFit?: string;
  hoverEffect?: boolean;
  imageUrl: string;
  ratio?: string;
}

const StudioImage = ({ onClick, objectFit = "object-cover", hoverEffect = true, imageUrl, ratio = "aspect-video" }: Props) => {
  return (
    <div className={`relative ${ratio} group w-full h-full cursor-pointer`}>
      <Image
        src={imageUrl}
        alt="images"
        fill
        sizes="(min-width: 1540px) 724px, (min-width: 1280px) 596px, (min-width: 1040px) 468px, (min-width: 780px) 340px, 276px"
        className={`${objectFit} rounded-md object-center ${hoverEffect && "transition-all duration-500 group-hover:brightness-50"}`}
        onClick={onClick}
      />
    </div>
  );
};

export default StudioImage;
