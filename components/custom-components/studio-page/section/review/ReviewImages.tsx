"use client";

import { useState } from "react";

import ReviewImageModal from "./ReviewImageModal";

import StudioImage from "@/components/custom-components/studio-card/StudioImage";

interface Props {
  imageList: string[];
  userProfile: { icon: string; name: string };
}

const ReviewImages = ({ imageList, userProfile }: Props) => {
  const [isOpenReviewImageModal, setOpenReviewImageModal] = useState(false);

  const openReviewImageModal = () => {
    setOpenReviewImageModal(true);
  };

  const closeReviewImageModal = () => {
    setOpenReviewImageModal(false);
  };

  return (
    <>
      {imageList.map((image) => (
        <StudioImage
          imageUrl={image}
          key={image}
          ratio="aspect-square"
          onClick={openReviewImageModal}
        />
      ))}

      <ReviewImageModal
        isOpen={isOpenReviewImageModal}
        onCloseModal={closeReviewImageModal}
        images={imageList}
        userProfile={userProfile}
      />
    </>
  );
};

export default ReviewImages;
