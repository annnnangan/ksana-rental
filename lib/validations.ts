import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { TZDate } from "@date-fns/tz";

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

export type Tbooking = z.infer<typeof bookingSchema>;
