import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { TZDate } from "@date-fns/tz";
import { districts } from "@/services/model";

//1. Booking Schema
//date.parse("2020-01-01"); // pass
//date, time, studio slug, remarks (optional), price
const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);
export const bookingSchema = z.object({
  date: z.coerce
    .date()
    .min(todayDate, { message: "You have selected a date in the past!" })
    .max(new Date(todayDate.getFullYear(), todayDate.getMonth() + 3, 0), {
      message: "You have selected a date exceed the allowed month",
    }),
  startTime: z
    .string()
    .time({ message: "Invalid time string." })
    .min(1, "Time is required"),
  studio: z.string().min(1, "Studio is required"),
  remarks: z.string().optional(),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .nonnegative(),
  whatsapp: z
    .string()
    .refine(
      isValidPhoneNumber,
      "Please specify a valid phone number (include the international prefix)."
    ),
});

export const bookingPhoneRemarksSchema = bookingSchema.partial({
  date: true,
  startTime: true,
  studio: true,
  price: true,
});

export type Tbooking = z.infer<typeof bookingSchema>;
export type TbookingPhoneRemarks = z.infer<typeof bookingPhoneRemarksSchema>;

//2. Studio Create Schema
export const allowedImageMineTypes = ["image/jpeg", "image/jpg", "image/png"];
export const maxFileSize = 1048576 * 2; // 2 MB
const allowedImageTypes = ["jpeg", "jpg", "png"];
const districtValues = districts
  .flatMap((item) => item.district)
  .map((location) => location.value) as [string, ...string[]];

export const studioSchema = z.object({
  coverImage: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= maxFileSize;
    }, "封面圖片容量超出2MB。")
    .refine(
      (files) => allowedImageTypes.includes(files?.[0]?.type),
      "封面圖片不支持此檔案格式，請上傳jpeg、jpg或png圖片檔案。"
    ),
  logo: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= maxFileSize;
    }, "Logo圖片容量超出2MB。")
    .refine(
      (files) => allowedImageTypes.includes(files?.[0]?.type),
      "Logo不支持此檔案格式，請上傳jpeg、jpg或png圖片檔案。"
    ),
  studioName: z
    .string()
    .min(1, "請填寫場地名稱。")
    .max(50, "場地名稱最多可接受50字。"),
  studioSlug: z
    .string()
    .regex(/^[a-zA-Z0-9-]*$/, "只接受英文字、數字和連字號(hyphens)。")
    .min(1, "請填寫場地網站別名。")
    .max(50, "場地網站別名最多可接受50字。"),
  studioDescription: z
    .string()
    .min(50, "請至少填寫50字的場地描述。")
    .max(65535),
  district: z.enum(districtValues, {
    errorMap: () => ({ message: "請選擇正確場地地區。" }),
  }),
  address: z.string().min(5, "請填寫正確場地地址。").max(100),
});

//2.1 Copy the studioSchema for step 1 - basic info
export const studioBasicInfoSchema = studioSchema.pick({
  studioName: true,
  studioSlug: true,
  studioDescription: true,
  district: true,
  address: true,
});
