import * as z from "zod";
import {
  allowedImageMineTypes,
  formattedMineTypes,
  maxReviewImageCount,
  maxReviewImageSize,
} from "../file";

const singleImageSchema = z.union([
  // For new image uploads
  z
    .instanceof(File)
    .refine((file) => allowedImageMineTypes.includes(file.type), {
      message: `不支持此檔案格式。請上傳${formattedMineTypes.join(
        ", "
      )}圖片檔案`,
    })
    .refine((file) => file.size <= maxReviewImageSize, {
      message: `每張圖片大小需小於${maxReviewImageSize / (1024 * 1024)}MB。`,
    }),
  z.string().url({ message: "圖片無法顯示。" }), // For existing AWS URLs
]);

export const reviewBookingSchema = z.object({
  rating: z.number().min(1, "請選擇評分。"),
  review: z
    .string()
    .min(10, "請以不少於10字寫下你的評論。")
    .max(200, "評論最多只可填寫200字。"),
  is_anonymous: z.boolean(),
  is_hide_from_public: z.boolean(),
  is_complaint: z.boolean(),
  images: z
    .array(singleImageSchema)
    .max(maxReviewImageCount, `最多只可上傳${maxReviewImageCount}張圖片。`),
});

export type reviewFormData = z.infer<typeof reviewBookingSchema>;
