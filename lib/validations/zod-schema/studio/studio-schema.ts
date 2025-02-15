import { districtValues, equipmentMap, payoutMethod } from "@/services/model";
import { isValidPhoneNumber } from "libphonenumber-js";
import * as z from "zod";
import { allowedImageMineTypes, formattedMineTypes, maxGalleryImageSize } from "../../file";
import { TimeslotsSchema } from "../timeslot-schema";

const daysOfWeekEnum = z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

// Define the schema for a single image for onboarding gallery step
const singleImageSchema = z.union([
  // For new image uploads
  z
    .instanceof(File)
    .refine((file) => allowedImageMineTypes.includes(file.type), {
      message: `不支持此檔案格式。請上傳${formattedMineTypes.join(", ")}圖片檔案`,
    })
    .refine((file) => file.size <= maxGalleryImageSize, {
      message: "檔案容量超出5MB。",
    }),
  z.string().url({ message: "圖片無法顯示。" }), // For existing AWS URLs
]);

export const BusinessHourSchema = z
  .object({
    is_enabled: z.boolean().default(false),
    timeslots: TimeslotsSchema.optional().default([]),
  })
  .refine((data) => !data.is_enabled || data.timeslots.length > 0, {
    message: "若該日營業，請至少提供一個時段。",
    path: ["timeslots"],
  });

export const studioSchema = z.object({
  name: z.string().min(1, "請填寫場地名稱。").max(50, "場地名稱最多可接受50字。"),
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
  businessHours: z.record(daysOfWeekEnum, BusinessHourSchema),
  peakHourPrice: z.string().min(1, "請填寫繁忙時段價格").regex(/^\d+$/, "價格必須是數字"),
  nonPeakHourPrice: z.string().min(1, "請填寫非繁忙時段價格").regex(/^\d+$/, "價格必須是數字"),
  equipment: z
    .array(
      z.enum(equipmentMap.map((item) => item.value) as [string, ...string[]], {
        errorMap: () => ({
          message: "設備類型無效。請選擇有效的設備類型。",
        }),
      })
    )
    .min(1, "請選擇至少一項設備"),
  gallery: z.array(singleImageSchema).min(3, { message: "請上傳至少3張圖片。" }).max(15, { message: "最多只能上傳15張圖片。" }),
  phone: z.string().refine(isValidPhoneNumber, "請輸入正確的電話號碼。"),
  social: z.object({
    website: z.string().url({ message: "請輸入有效網站。" }).optional().or(z.literal("")),
    instagram: z.string().url({ message: "請輸入有效Instagram網站。" }),
    facebook: z.string().url({ message: "請輸入有效Facebook網站。" }).optional().or(z.literal("")),
    youtube: z.string().url({ message: "請輸入有效Youtube網站。" }).optional().or(z.literal("")),
  }),
  payoutMethod: z.enum(payoutMethod.map((item) => item.value) as [string], {
    errorMap: () => ({
      message: "收帳方法無效。請選擇有效的收帳方法。",
    }),
  }),
  payoutAccountName: z.string().min(5, "請填寫正確帳戶名稱。").max(50, "請填寫正確帳戶名稱。"),
  payoutAccountNumber: z.string().regex(/^\d+$/, "請填寫正確帳戶號碼。").min(5, "請填寫正確帳戶號碼。").max(50, "請填寫正確帳戶號碼。"),
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
  dateSpecificHour: z.object({
    date: z.union([z.string().refine((d) => !isNaN(Date.parse(d)), { message: "請選擇有效的日期。" }), z.date().refine((d) => !isNaN(d.getTime()), { message: "請選擇日期。" })]),
    timeslots: TimeslotsSchema,
  }),
});
