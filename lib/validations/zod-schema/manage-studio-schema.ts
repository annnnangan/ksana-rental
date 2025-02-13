// Schema for a specific date with time slots
import { z } from "zod";
import { timeSlotSchema, validateNoOverlap } from "./timeslot-schema";

// Schema for date-specific hours with time slots
export const DateSpecificHoursSchema = z.object({
  date: z.date().refine((d) => !isNaN(d.getTime()), { message: "請選擇日期。" }),
  timeslots: z
    .array(timeSlotSchema)
    .optional()
    .default([{ from: "00:00", to: "18:00", price_type: "non-peak" }])
    .superRefine(validateNoOverlap),
});

export type DateSpecificHoursSchemaFormData = z.infer<typeof DateSpecificHoursSchema>;
