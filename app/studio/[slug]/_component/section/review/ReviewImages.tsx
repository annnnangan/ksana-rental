"use client";

import React, { useState } from "react";
import StudioImage from "../../../../../_components/studio/StudioImage";
import ReviewImageModal from "./ReviewImageModal";
import { ReviewUserProfile } from "./ReviewSection";

interface Props {
  imageList: string[];
  userProfile: ReviewUserProfile;
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