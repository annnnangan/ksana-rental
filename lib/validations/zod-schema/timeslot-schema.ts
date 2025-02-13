import { z } from "zod";

// Regular expression for HH:mm 24-hour format
const startTimeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const endTimeRegex = /^([01]\d|2[0-4]):([0-5]\d)$/;

// Allowed price types
const priceTypes = ["peak", "non-peak"] as const;

/**
 * Validates that time slots do not overlap.
 */
export const validateNoOverlap = (slots: { from: string; to: string }[], ctx: z.RefinementCtx) => {
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

// Schema for individual time slot
export const timeSlotSchema = z
  .object({
    from: z.string().regex(startTimeRegex, "請填寫開始時間。"),
    to: z.string().regex(endTimeRegex, "請填寫結束時間。"),
    price_type: z.enum(priceTypes, {
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
