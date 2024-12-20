"use client";
import { Button } from "@/components/ui/button";
import { ImageUpIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import ImagePreview from "./ImagePreview";

const GalleryForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //convert `FileList` to `File[]`
      const _files = Array.from(e.target.files);
      //append image together
      setImages([...images, ..._files]);
      //reset input after upload
      e.target.value = "";
    }
  };

  const removeImage = (imageIndex: number) => {
    setImages(images.filter((image, index) => index !== imageIndex));
  };

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  return (
    <form>
      <div className="my-5 flex justify-center items-center flex-col rounded-md">
        <Button
          className="rounded-full text-sm border-primary hover:bg-primary hover:text-white mt-2"
          variant="outline"
          type="button"
          onClick={handleClick}
        >
          <ImageUpIcon /> 上載圖片
        </Button>
        <p className="text-gray-500 mt-2 text-sm">
          上傳的每張相片大小不超過5MB，合共可上傳15張。
        </p>
      </div>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        multiple
        onChange={handleFileSelected}
        className="hidden"
        ref={hiddenFileInput}
      />
      <ImagePreview images={images} removeImage={removeImage} />
    </form>
  );
};

export default GalleryForm;
