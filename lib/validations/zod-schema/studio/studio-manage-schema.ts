import { z } from "zod";
import { studioSchema } from "./studio-schema";

/* ------------------------ Date Specific Hour ------------------------ */
export const DateSpecificHourSchema = studioSchema.pick({
  dateSpecificHour: true,
});

export type DateSpecificHourSchemaFormData = z.infer<typeof DateSpecificHourSchema>;
