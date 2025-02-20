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
  phone: true,
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
export const EquipmentSchema = StudioSchema.pick({
  equipment: true,
});

export type EquipmentFormData = z.infer<typeof EquipmentSchema>;

/* ------------------ Step 4: Gallery - upload studio image ----------------- */
export const GallerySchema = StudioSchema.pick({
  gallery: true,
});

export type GalleryFormData = z.infer<typeof GallerySchema>;

/* -------------------------- Step 5: Door Password ------------------------- */
export const DoorPasswordSchema = StudioSchema.pick({
  doorPassword: true,
});

export type DoorPasswordFormData = z.infer<typeof DoorPasswordSchema>;

/* ----------------------------- Step 6: Social ---------------------------- */
export const SocialSchema = StudioSchema.pick({
  social: true,
});

export type SocialFormData = z.infer<typeof SocialSchema>;
export type SocialChannelKeys = keyof z.infer<typeof SocialSchema>;

/* ------------------------- Step 7: Payout Details ------------------------- */
export const PayoutSchema = StudioSchema.pick({
  payoutMethod: true,
  payoutAccountName: true,
  payoutAccountNumber: true,
});
export type PayoutFormData = z.infer<typeof PayoutSchema>;

/* -------------------------- Step 8: Confirmation -------------------------- */
export const OnboardingTermsSchema = StudioSchema.pick({
  onboardingTerms: true,
});

export type OnboardingTermsFormData = z.infer<typeof OnboardingTermsSchema>;
