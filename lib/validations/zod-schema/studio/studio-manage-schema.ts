import { z } from "zod";
import { StudioSchema } from "./studio-schema";

/* ------------------------ Date Specific Hour ------------------------ */
export const DateSpecificHourSchema = StudioSchema.pick({
  dateSpecificHour: true,
});

export type DateSpecificHourSchemaFormData = z.infer<typeof DateSpecificHourSchema>;

/* ------------------------ Basic Info ------------------------ */
export const ManageStudioBasicInfoSchema = StudioSchema.pick({
  logo: true,
  cover: true,
  description: true,
  district: true,
  address: true,
});

export type ManageStudioBasicInfoFormData = z.infer<typeof ManageStudioBasicInfoSchema>;
