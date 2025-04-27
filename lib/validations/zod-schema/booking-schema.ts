import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import { fromTimeRegex } from "./timeslot-schema";

//1. Booking Schema
//date.parse("2020-01-01"); // pass
//date, time, studioSlug slug, remarks (optional), price
const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);
export const BookingSchema = z.object({
  date: z.coerce
    .date()
    .min(todayDate, { message: "不能選擇過去的日期。" })
    .max(new Date(todayDate.getFullYear(), todayDate.getMonth() + 3, 0), {
      message: "你所選擇之日期已超出可預約的範圍。",
    }),
  startTime: z.string().regex(fromTimeRegex, "請選擇開始時間。"),
  studioSlug: z.string().min(1, "請選擇預約場地。"),
  studioName: z.string().min(1, "請選擇預約場地。"),
  studioAddress: z.string().min(1, "請選擇預約場地。"),
  studioLogo: z.string().url({ message: "圖片無法顯示。" }),
  isUsedCredit: z.boolean().default(false),
  price: z.number().nonnegative(),
  usedCredit: z.number().nonnegative().default(0),
  paidAmount: z.number().nonnegative(),
  phone: z.string().refine(isValidPhoneNumber, "請填寫正確電話號碼。"),
  remarks: z.string().optional(),
  agreeBookingTerms: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "必須同意條款與細則",
    }),
});

export const BookingDateTimeSelectSchema = BookingSchema.pick({
  date: true,
  startTime: true,
  studioSlug: true,
  studioName: true,
  studioAddress: true,
  studioLogo: true,
  isUsedCredit: true,
  price: true,
  usedCredit: true,
  paidAmount: true,
}).superRefine(({ date, startTime }, ctx) => {
  if (!date || !startTime) return;

  const [hours, minutes] = startTime.split(":").map(Number);

  const selectedDateTime = new Date(date);
  selectedDateTime.setHours(hours, minutes, 0, 0);

  // Check if the selected date-time is in the past
  if (selectedDateTime < todayDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "不能選擇過去的時間。",
      path: ["startTime"],
    });
  }
});

export type BookingDateTimeSelectFormData = z.infer<typeof BookingDateTimeSelectSchema>;
export type BookingFormData = z.infer<typeof BookingSchema>;

// export const bookingPhoneRemarksSchema = bookingSchema.partial({
//   date: true,
//   startTime: true,
//   studioSlug: true,
//   price: true,
// });

// export type Tbooking = z.infer<typeof bookingSchema>;
// export type TbookingPhoneRemarks = z.infer<typeof bookingPhoneRemarksSchema>;
