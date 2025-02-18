import * as z from "zod";
import { BusinessHourSchema, StudioSchema } from "./studio-schema";

/* ----------------------- Step 0: Enter studio name ---------------------- */
export const StudioNameSchema = StudioSchema.pick({
  name: true,
});

export type StudioNameFormData = z.infer<typeof StudioNameSchema>;

/* ----------------- Step 1: Enter studio basic information ----------------- */
export const BasicInfoSchema = StudioSchema.pick({
  logo: true,
  cover_photo: true,
  name: true,
  slug: true,
  description: true,
  district: true,
  address: true,
});

export type BasicInfoFormData = z.infer<typeof BasicInfoSchema>;

/* -------------- Step 2: Enter studio business hours and price ------------- */
export const BusinessHoursAndPriceSchema = StudioSchema.pick({
  businessHours: true,
  peakHourPrice: true,
  nonPeakHourPrice: true,
});

export type BusinessHourType = z.infer<typeof BusinessHourSchema>;
export type BusinessHoursAndPriceFormData = z.infer<typeof BusinessHoursAndPriceSchema>;

/* --------------------- Step 3: Enter studio equipment --------------------- */
export const studioEquipmentSchema = StudioSchema.pick({
  equipment: true,
});

export type studioEquipmentFormData = z.infer<typeof studioEquipmentSchema>;

/* ------------------ Step 4: Gallery - upload studio image ----------------- */
export const studioGallerySchema = StudioSchema.pick({
  gallery: true,
});

export type studioGalleryFormData = z.infer<typeof studioGallerySchema>;

/* ----------------------------- Step 5: Contact ---------------------------- */
export const studioContactSchema = StudioSchema.pick({
  phone: true,
  social: true,
});

export type studioContactFormData = z.infer<typeof studioContactSchema>;
export type socialChannelKeys = keyof z.infer<typeof studioContactSchema>;

/* ------------------------- Step 6: Payout Details ------------------------- */
export const StudioPayoutSchema = StudioSchema.pick({
  payoutMethod: true,
  payoutAccountName: true,
  payoutAccountNumber: true,
});
export type StudioPayoutFormData = z.infer<typeof StudioPayoutSchema>;

/* -------------------------- Step 7: Door Password ------------------------- */
const StudioDoorPasswordBaseSchema = StudioSchema.pick({
  isRevealDoorPassword: true,
  doorPassword: true,
});

export const StudioDoorPasswordSchema = StudioDoorPasswordBaseSchema.refine((data) => data.isRevealDoorPassword === "false" || (data.isRevealDoorPassword === "true" && data.doorPassword?.length), {
  message: "請填寫大門密碼。",
  path: ["doorPassword"], // Attach the error to the doorPassword field
});

export type StudioDoorPasswordFormData = z.infer<typeof StudioDoorPasswordSchema>;

/* -------------------------- Step 8: Confirmation -------------------------- */
export const StudioOnBoardingTermsSchema = StudioSchema.pick({
  onboardingTerms: true,
});

export type StudioOnBoardingTermsFormData = z.infer<typeof StudioOnBoardingTermsSchema>;
