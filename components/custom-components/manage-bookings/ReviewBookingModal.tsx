"use client";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import ErrorMessage from "../ErrorMessage";
import ImagesGridPreview from "../ImagesGridPreview";

import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

import {
  convertTimeToString,
  formatDate,
} from "@/lib/utils/date-time/date-time-utils";
import {
  reviewBookingSchema,
  reviewFormData,
} from "@/lib/validations/zod-schema/review-booking-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useTransition } from "react";
import { BookingRecord } from "./BookingRecordCard";
import {
  addUploadTimestampToFile,
  generateAWSImageUrls,
} from "@/lib/utils/s3-upload/s3-image-upload-utils";
import { reviewBooking } from "@/actions/booking";
import { toast } from "react-toastify";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  setOpenModal: (open: boolean) => void;
  bookingRecord: BookingRecord;
}

const ReviewBookingModal = ({ isOpen, setOpenModal, bookingRecord }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    setValue,
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<reviewFormData>({
    resolver: zodResolver(reviewBookingSchema),
    defaultValues: {
      rating: 1,
      review: "",
      is_anonymous: false,
      is_hide_from_public: false,
      is_complaint: false,
      images: [],
    },
  });

  const imagesList = watch("images");

  // Handle form submission
  const onSubmit = async (data: reviewFormData) => {
    if (bookingRecord.has_reviewed) {
      toast("你已評論過此預約，不能再作評論。", {
        position: "top-right",
        type: "error",
        autoClose: 1000,
      });
      return;
    }

    if (data.images.length > 0) {
      // Generate AWS Image URLs
      const imagesUrl = await generateAWSImageUrls(
        data.images as File[],
        "review",
        "review"
      );

      if (!imagesUrl.success) {
        toast("評論圖片無法儲存，請重試。", {
          position: "top-right",
          type: "error",
          autoClose: 1000,
        });
        return;
      }

      data = { ...data, images: imagesUrl.data! };
    }

    startTransition(() => {
      reviewBooking(bookingRecord.booking_reference_no, data).then((data) => {
        toast(data.error?.message || "你已成功撰寫評論。", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });
        reset();
        setOpenModal(false);
        router.refresh();
      });
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //convert FileList to array
      const newFiles = Array.from(e.target.files);
      const newImageURLs = newFiles.map((file, index) =>
        addUploadTimestampToFile(file, index)
      );
      setValue("images", [...imagesList, ...newImageURLs], {
        shouldValidate: true,
      });
      //reset input after upload
      e.target.value = "";
    }
  };

  const handleImageRemove = (identifier: string | number, imageSrc: string) => {
    const updatedImages = imagesList.filter(
      (image) => !(image instanceof File && image.lastModified === identifier)
    );
    URL.revokeObjectURL(imageSrc);
    setValue("images", updatedImages);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent hideClose className="max-h-full overflow-y-auto">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>撰寫場地評論</DialogTitle>

          <DialogDescription>
            預約編號: {bookingRecord.booking_reference_no}
          </DialogDescription>
        </DialogHeader>

        <p className="mb-4">
          請為你於 {formatDate(new Date(bookingRecord.booking_date))}{" "}
          {convertTimeToString(bookingRecord.start_time)} -{" "}
          {convertTimeToString(bookingRecord.end_time)} 在{" "}
          {bookingRecord.studio_name} 的場地體驗，提供評分及評論。
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Rating Component */}
          <div className="flex flex-col">
            <Label className="font-bold mb-1">評分</Label>

            <Controller
              name="rating"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Rating
                  style={{ maxWidth: 150 }}
                  value={field.value}
                  onChange={(value: number) => setValue("rating", value)}
                  isRequired
                />
              )}
            />
          </div>

          {/* Comment Textarea */}
          <div className="flex flex-col">
            <Label className="font-bold mb-1">評論</Label>
            <Textarea
              {...register("review")}
              placeholder="請以不少於10字寫下你的評論。"
              rows={4}
            />
            {errors.review && (
              <ErrorMessage>{errors.review?.message}</ErrorMessage>
            )}
          </div>

          <div>
            <div className="flex flex-col">
              <Label className="font-bold mb-1">上傳圖片</Label>
              <p className="text-xs text-gray-800 mb-2">
                最多只可上傳5張圖片，每張圖片大小需小於1MB。
              </p>

              <Controller
                control={control}
                name={"images"}
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <input
                      {...field}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      multiple
                      className="text-sm"
                      onChange={handleFileSelect}
                    />
                  );
                }}
              />
            </div>

            {errors.images && (
              <ErrorMessage>{errors.images?.message}</ErrorMessage>
            )}

            {imagesList.length > 0 && (
              <div className="mt-5 mb-20">
                <Label className="font-bold mb-1">圖片預覽</Label>
                <ImagesGridPreview
                  images={imagesList}
                  removeImage={handleImageRemove}
                  imageAlt={"Rating image"}
                  allowDeleteImage={isSubmitting ? false : true}
                  gridCol={2}
                  gridColSpan={"col-span-1"}
                  objectFit="object-contain"
                />
              </div>
            )}
          </div>

          {/* Checkboxes for Anonymous, Public, and Complaint */}
          <div className="flex flex-col space-y-4">
            <Controller
              name="is_anonymous"
              control={control}
              render={({ field }) => (
                <Label>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  是否匿名評論？
                </Label>
              )}
            />
            <Controller
              name="is_hide_from_public"
              control={control}
              render={({ field }) => (
                <Label>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  是否隱藏評論？
                </Label>
              )}
            />
            <Controller
              name="is_complaint"
              control={control}
              render={({ field }) => (
                <Label>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  是否向Ksana投訴？
                </Label>
              )}
            />
          </div>

          <div className="flex items-center gap-3 mt-5">
            <SubmitButton
              isSubmitting={isSubmitting}
              nonSubmittingText="確認"
              className="w-1/2"
            />

            <Button
              type="button"
              variant="outline"
              className="w-1/2 mt-5"
              disabled={isSubmitting}
              onClick={() => {
                reset();
                setOpenModal(false);
              }}
            >
              取消
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewBookingModal;
