import React from "react";
import GalleryForm from "./GalleryForm";
import ImagePreview from "./ImagePreview";
import StepTitle from "../_component/StepTitle";

const GalleryPage = () => {
  return (
    <>
      <div>
        <StepTitle>上傳場地照片</StepTitle>
        <p className="text-sm md:text-base mb-6">請上傳最多15張場地照片。</p>
      </div>
      <GalleryForm />
    </>
  );
};

export default GalleryPage;
