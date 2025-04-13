"use client";
import ErrorMessage from "@/components/custom-components/common/ErrorMessage";
import { Button } from "@/components/shadcn/button";
import { generateAWSImageUrls } from "@/lib/utils/s3-upload/s3-image-upload-utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useTransition } from "react";
import { FieldError, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { deleteGalleryImages, saveGallery } from "@/actions/studio";
import SubmitButton from "@/components/custom-components/common/buttons/SubmitButton";
import ImagesGridPreview from "@/components/custom-components/ImagesGridPreview";
import {
  GalleryFormData,
  GallerySchema,
} from "@/lib/validations/zod-schema/studio/studio-step-schema";

interface Props {
  defaultValues: string[];
  studioId: string;
  isOnboardingStep: boolean;
}

const GalleryForm = ({ defaultValues, studioId, isOnboardingStep }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [awsImagesToDelete, setAWSImagesToDelete] = useState<string[]>([]); // To track to be deleted AWS images
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(GallerySchema),
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

  const onSubmit = async (data: GalleryFormData) => {
    try {
      // Delete image in database and AWS when user clicks delete button on the existing image and save
      if (awsImagesToDelete) {
        // Use a flag to track if deletion fails
        const deleteFailed = await Promise.all(
          awsImagesToDelete.map(async (image) => {
            // Delete from AWS
            const awsResponse = await fetch("/api/s3-image", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ image }),
            });

            if (!awsResponse.ok) {
              toast("圖片無法刪除，請重試。", {
                position: "top-right",
                type: "error",
                autoClose: 1000,
              });
              router.refresh();
              return true; // Mark deletion as failed
            }

            // Delete from database if AWS deletion was successful
            await deleteGalleryImages([image], studioId);
            return false; // Mark deletion as successful
          })
        );

        // If any deletion failed, stop further execution
        if (deleteFailed.includes(true)) {
          return; // Exit the function early
        }
      }

      const newUploadImages: File[] = data.gallery.filter((image) => image instanceof File);

      const newUploadImageUrls = await generateAWSImageUrls(
        newUploadImages as File[],
        `studio/${studioId}/gallery`,
        "gallery"
      );

      if (!newUploadImageUrls.success) {
        toast("圖片無法儲存，請重試。", {
          position: "top-right",
          type: "error",
          autoClose: 1000,
        });
        return;
      } else {
        startTransition(() => {
          saveGallery(newUploadImageUrls.data, studioId, isOnboardingStep).then((data) => {
            toast(data.error?.message || "儲存成功。", {
              position: "top-right",
              type: data?.success ? "success" : "error",
              autoClose: 1000,
            });
            router.refresh();

            if (isOnboardingStep && data.success) {
              router.push(`/studio-owner/studio/${studioId}/onboarding/door-password`);
            }
          });
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "系統發生未預期錯誤，請重試。";
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
        <p className="text-gray-500 mt-2 text-sm">上傳的每張相片大小不超過5MB。</p>
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
        gridCol={"grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}
        images={gallery}
        removeImage={removeImage}
        error={errors.gallery as FieldError[] | undefined}
        imageAlt={"studio image"}
        allowDeleteImage={true}
      />
      <SubmitButton
        isSubmitting={isSubmitting || isPending}
        nonSubmittingText={isOnboardingStep ? "往下一步" : "儲存"}
        withIcon={isOnboardingStep ? true : false}
      />
    </form>
  );
};

export default GalleryForm;
