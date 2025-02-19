import { districtValues, equipmentMap, payoutMethod } from "@/services/model";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import {
  allowedImageMineTypes,
  formattedMineTypes,
  maxGalleryImageSize,
} from "./validations/file";

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

const daysOfWeekEnum = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export const TimeSlotSchema = z.object({
  open: z.string().min(1, "請填寫開始時間"),
  close: z.string().min(1, "請填寫結束時間"),
  priceType: z.enum(["peak", "non-peak"]),
});

const businessHourSchema = z.object({
  enabled: z.boolean(),
  timeSlots: z
    .array(TimeSlotSchema)
    .refine(
      (timeSlots) =>
        timeSlots.every(
          (slot, i) =>
            !timeSlots.some(
              (other, j) =>
                i !== j &&
                ((slot.open >= other.open && slot.open < other.close) ||
                  (slot.close > other.open && slot.close <= other.close))
            )
        ),
      "時段不能重疊"
    )
    .optional(),
});

// Define the schema for a single image for onboarding gallery step
const singleImageSchema = z.union([
  // For new image uploads
  z
    .instanceof(File)
    .refine((file) => allowedImageMineTypes.includes(file.type), {
      message: `不支持此檔案格式。請上傳${formattedMineTypes.join(
        ", "
      )}圖片檔案`,
    })
    .refine((file) => file.size <= maxGalleryImageSize, {
      message: "檔案容量超出5MB。",
    }),
  z.string().url({ message: "圖片無法顯示。" }), // For existing AWS URLs
]);

//All onboarding step schema
export const studioSchema = z.object({
  name: z
    .string()
    .min(1, "請填寫場地名稱。")
    .max(50, "場地名稱最多可接受50字。"),
  slug: z
    .string()
    .regex(/^[a-zA-Z0-9-]*$/, "只接受英文字、數字和連字號(hyphens)。")
    .min(1, "請填寫場地網站別名。")
    .max(50, "場地網站別名最多可接受50字。"),
  description: z.string().min(50, "請至少填寫50字的場地描述。").max(65535),
  district: z.enum(districtValues, {
    errorMap: () => ({ message: "請選擇正確場地地區。" }),
  }),
  address: z.string().min(5, "請填寫正確場地地址。").max(100),
  businessHours: z.record(daysOfWeekEnum, businessHourSchema),
  peakHourPrice: z
    .string()
    .min(1, "請填寫繁忙時段價格")
    .regex(/^\d+$/, "價格必須是數字"),
  nonPeakHourPrice: z
    .string()
    .min(1, "請填寫非繁忙時段價格")
    .regex(/^\d+$/, "價格必須是數字"),
  equipment: z
    .array(
      z.enum(equipmentMap.map((item) => item.value) as [string, ...string[]], {
        errorMap: () => ({
          message: "設備類型無效。請選擇有效的設備類型。",
        }),
      })
    )
    .min(1, "請選擇至少一項設備"),
  gallery: z
    .array(singleImageSchema)
    .min(3, { message: "請上傳至少3張圖片。" })
    .max(15, { message: "最多只能上傳15張圖片。" }),
  phone: z.string().refine(isValidPhoneNumber, "請輸入正確的電話號碼。"),
  social: z.object({
    website: z
      .string()
      .url({ message: "請輸入有效網站。" })
      .optional()
      .or(z.literal("")),
    instagram: z.string().url({ message: "請輸入有效Instagram網站。" }),
    facebook: z
      .string()
      .url({ message: "請輸入有效Facebook網站。" })
      .optional()
      .or(z.literal("")),
    youtube: z
      .string()
      .url({ message: "請輸入有效Youtube網站。" })
      .optional()
      .or(z.literal("")),
  }),
  payoutMethod: z.enum(payoutMethod.map((item) => item.value) as [string], {
    errorMap: () => ({
      message: "收帳方法無效。請選擇有效的收帳方法。",
    }),
  }),
  payoutAccountName: z
    .string()
    .min(5, "請填寫正確帳戶名稱。")
    .max(50, "請填寫正確帳戶名稱。"),
  payoutAccountNumber: z
    .string()
    .regex(/^\d+$/, "請填寫正確帳戶號碼。")
    .min(5, "請填寫正確帳戶號碼。")
    .max(50, "請填寫正確帳戶號碼。"),
  isRevealDoorPassword: z.enum(["true", "false"], {
    errorMap: () => ({
      message: "請選擇是否同意由Ksana向租用場地者發送大門密碼。",
    }),
  }),
  doorPassword: z.string().optional(),
  onboardingTerms: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "必須同意條款與細則",
    }),
});

//Extract part of the studio schema for each onboarding step
//Step 0: Enter studio name
export const studioNameSchema = studioSchema.pick({
  name: true,
});

//Step 1: Enter studio basic information
export const studioBasicInfoSchema = studioSchema.pick({
  name: true,
  slug: true,
  description: true,
  district: true,
  address: true,
});

//Step 2: Enter studio business hours and price
export const studioBusinessHourAndPriceSchema = studioSchema.pick({
  businessHours: true,
  peakHourPrice: true,
  nonPeakHourPrice: true,
});

export type TimeSlotKeys = keyof z.infer<typeof TimeSlotSchema>;
export type businessHourType = z.infer<typeof businessHourSchema>;
export type studioBusinessHourAndPriceFormData = z.infer<
  typeof studioBusinessHourAndPriceSchema
>;

//Step 3: Enter studio equipment
export const studioEquipmentSchema = studioSchema.pick({
  equipment: true,
});

export type studioEquipmentFormData = z.infer<typeof studioEquipmentSchema>;

//Step 4: Gallery - upload studio image
export const studioGallerySchema = studioSchema.pick({
  gallery: true,
});

export type studioGalleryFormData = z.infer<typeof studioGallerySchema>;

//Step 4: Contact
export const studioContactSchema = studioSchema.pick({
  phone: true,
  social: true,
});

export type studioContactFormData = z.infer<typeof studioContactSchema>;
export type socialChannelKeys = keyof z.infer<typeof studioContactSchema>;

//Step 5: Payout Details
export const StudioPayoutSchema = studioSchema.pick({
  payoutMethod: true,
  payoutAccountName: true,
  payoutAccountNumber: true,
});
export type StudioPayoutFormData = z.infer<typeof StudioPayoutSchema>;

//Step 6: Door Password
const StudioDoorPasswordBaseSchema = studioSchema.pick({
  isRevealDoorPassword: true,
  doorPassword: true,
});

// Add the conditional validation logic
export const StudioDoorPasswordSchema = StudioDoorPasswordBaseSchema.refine(
  (data) =>
    data.isRevealDoorPassword === "false" ||
    (data.isRevealDoorPassword === "true" && data.doorPassword?.length),
  {
    message: "請填寫大門密碼。",
    path: ["doorPassword"], // Attach the error to the doorPassword field
  }
);

export type StudioDoorPasswordFormData = z.infer<
  typeof StudioDoorPasswordSchema
>;

//Step 7: Confirmation
export const StudioOnBoardingTermsSchema = studioSchema.pick({
  onboardingTerms: true,
});

export type StudioOnBoardingTermsFormData = z.infer<
  typeof StudioOnBoardingTermsSchema
>;
