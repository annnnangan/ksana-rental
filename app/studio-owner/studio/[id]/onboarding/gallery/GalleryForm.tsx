"use client";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { studioGalleryFormData, studioGallerySchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpIcon } from "lucide-react";
import React, { useRef } from "react";
import { FieldError, useForm } from "react-hook-form";
import ImagePreview from "./ImagePreview";

const GalleryForm = () => {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<studioGalleryFormData>({
    resolver: zodResolver(studioGallerySchema),
    defaultValues: {
      gallery: [],
    },
  });

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleUploadBtnClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const removeImage = (imageIndex: number) => {
    const updatedImages = gallery.filter(
      (image, index) => index !== imageIndex
    );
    setValue("gallery", updatedImages, { shouldValidate: true });
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //convert `FileList` to `File[]`
      const _files = Array.from(e.target.files);
      //Append image every time when upload image
      const updatedImages = [...gallery, ..._files];
      //Update the gallery
      setValue("gallery", updatedImages, { shouldValidate: true });
      //reset input after upload
      e.target.value = "";
    }
  };

  const gallery = watch("gallery");

  return (
    <form>
      <div className="my-5 flex justify-center items-center flex-col rounded-md">
        <Button
          className="rounded-full text-sm border-primary hover:bg-primary hover:text-white mt-2"
          variant="outline"
          type="button"
          onClick={handleUploadBtnClick}
        >
          <ImageUpIcon /> 上載圖片
        </Button>
        <p className="text-gray-500 mt-2 text-sm">
          上傳的每張相片大小不超過5MB。
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
      <div className="mb-2">
        <ErrorMessage>{errors.gallery?.message}</ErrorMessage>
      </div>
      <ImagePreview
        images={gallery}
        removeImage={removeImage}
        error={errors.gallery as FieldError[] | undefined}
      />
    </form>
  );
};

export default GalleryForm;
