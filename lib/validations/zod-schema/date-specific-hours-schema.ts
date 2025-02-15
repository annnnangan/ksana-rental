// Schema for a specific date with time slots
import { z } from "zod";

// 📓 Schema for date-specific hours with time slots

// Regular expression for HH:mm 24-hour format
const fromTimeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const toTimeRegex = /^([01]\d|2[0-4]):([0-5]\d)$/;

// Allowed price types
const priceTypes = ["peak", "non-peak"] as const;

const validateNoOverlapTimeslots = (slots: { from: string; to: string }[], ctx: z.RefinementCtx) => {
  if (slots.length > 0) {
    // Sort time slots by start time
    const sortedSlots = [...slots].sort((a, b) => a.from.localeCompare(b.from));

    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const current = sortedSlots[i];
      const next = sortedSlots[i + 1];

      // Check for overlap: next.from should be >= current.to
      if (next.from < current.to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `時段${current.from} - ${current.to} 和 時段${next.from} - ${next.to}有重疊。`,
        });
      }
    }
  }
};

const timeSlotSchema = z
  .object({
    from: z.string().regex(fromTimeRegex, "請填寫開始時間。"),
    to: z.string().regex(toTimeRegex, "請填寫結束時間。"),
    priceType: z.enum(priceTypes, {
      errorMap: () => ({ message: "請選擇Peak 或者 Non-Peak Hour" }),
    }),
  })
  .superRefine((slot, ctx) => {
    if (slot.from >= slot.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "開始時間需早於結束時間。",
        path: ["from"], // Attach error to the 'from' field
      });
    }
  });

export const DateSpecificHoursSchema = z.object({
  date: z.union([z.string().refine((d) => !isNaN(Date.parse(d)), { message: "請選擇有效的日期。" }), z.date().refine((d) => !isNaN(d.getTime()), { message: "請選擇日期。" })]),
  timeslots: z.array(timeSlotSchema).optional().default([]).superRefine(validateNoOverlapTimeslots),
});

export type DateSpecificHoursSchemaFormData = z.infer<typeof DateSpecificHoursSchema>;
