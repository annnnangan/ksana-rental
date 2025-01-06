import React from "react";
import Image from "next/image";

interface Props {
  onClick: () => void;
}

const GalleryImage = ({ onClick }: Props) => {
  return (
    <button type="button">
      <Image
        src="https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/acro/acro-yoga-gallery-1.jpg"
        alt="images"
        height={300}
        width={450}
        className="object-fit object-center h-full w-full transition-all duration-500 hover:brightness-50"
        onClick={onClick}
      />
    </button>
  );
};

export default GalleryImage;
