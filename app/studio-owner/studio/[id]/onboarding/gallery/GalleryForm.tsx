"use client";
import ErrorMessage from "@/components/custom-components/ErrorMessage";
import { Button } from "@/components/shadcn/button";
import { uploadImage } from "@/lib/utils/s3-upload/s3-image-upload-utils";
import { studioGalleryFormData, studioGallerySchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SubmitButton from "../_component/SubmitButton";

import { getOnboardingStep } from "@/lib/utils/get-onboarding-step-utils";
import ImagesGridPreview from "@/components/custom-components/ImagesGridPreview";

interface Props {
  defaultValues: string[];
  studioId: number;
}

const GalleryForm = ({ defaultValues, studioId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [awsImagesToDelete, setAWSImagesToDelete] = useState<string[]>([]); // To track to be deleted AWS images
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<studioGalleryFormData>({
    resolver: zodResolver(studioGallerySchema),
    defaultValues: {
      gallery: [...defaultValues],
    },
  });

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleUploadBtnClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const removeImage = async (identifier: string | number) => {
    // Distinguish between AWS URL and File using identifier type
    if (typeof identifier === "string") {
      // Remove existing image
      const updatedImages = gallery.filter((image) => image !== identifier);
      setAWSImagesToDelete((prev) => [...prev, identifier]);
      setValue("gallery", updatedImages, { shouldValidate: true });
      // Optionally delete the image from S3
      // await deleteImageFromS3(identifier);
    } else {
      // Remove new uploaded image
      const updatedImages = gallery.filter(
        (image) => !(image instanceof File && image.lastModified === identifier)
      );
      setValue("gallery", updatedImages, { shouldValidate: true });
    }
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

  const onSubmit = async (data: studioGalleryFormData) => {
    try {
      //Delete image in database and AWS when user click delete button on the existing image
      if (awsImagesToDelete) {
        awsImagesToDelete.forEach(async (image) => {
          const awsResponse = await fetch("/api/s3", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(image),
          });

          if (awsResponse.ok) {
            await fetch(`/api/studio/${studioId}/gallery`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(image),
            });
          }
        });
      }
      const errorResponse = await Promise.all(
        data.gallery
          .filter((image) => image instanceof File) // Only upload File objects (new images)
          .map(
            async (image) =>
              await uploadImage(
                image,
                "gallery",
                studioId,
                `/api/studio/${studioId}/gallery`,
                "PUT",
                "studios"
              )
          )
      );

      const error = errorResponse.filter(
        (errorMessage) => errorMessage !== undefined
      );

      if (error.length > 0) {
        throw new Error("系統發生未預期錯誤，請重試。");
      }

      //Save Onboarding Step Track
      const onboardingStep = getOnboardingStep(pathname);
      const completeOnboardingStepResponse = await fetch(
        `/api/studio/${studioId}/onboarding-step`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            onboardingStep,
          }),
        }
      );

      if (!completeOnboardingStepResponse.ok) {
        // If the response status is not 2xx, throw an error with the response message
        const errorData = await completeOnboardingStepResponse.json();
        throw new Error(errorData?.error.message || "系統發生未預期錯誤。");
      }

      router.push(`/studio-owner/studio/${studioId}/onboarding/door-password`);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "系統發生未預期錯誤，請重試。";
      toast(errorMessage, {
        position: "top-right",
        type: "error",
        autoClose: 1000,
      });
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <ImagesGridPreview
        images={gallery}
        removeImage={removeImage}
        error={errors.gallery as FieldError[] | undefined}
        imageAlt={"studio image"}
        allowDeleteImage={true}
      />
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default GalleryForm;
