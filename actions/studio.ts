"use server";

import handleError from "@/lib/handlers/error";
import { UnauthorizedError, ValidationError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { DateSpecificHourSchema, DateSpecificHourSchemaFormData } from "@/lib/validations/zod-schema/studio/studio-manage-schema";
import {
  BasicInfoFormData,
  BasicInfoSchema,
  BusinessHoursAndPriceFormData,
  BusinessHoursAndPriceSchema,
  DoorPasswordFormData,
  EquipmentFormData,
  EquipmentSchema,
  GalleryFormData,
  OnboardingTermsFormData,
  OnboardingTermsSchema,
  PayoutFormData,
  PayoutSchema,
  SocialFormData,
  SocialSchema,
  StudioNameFormData,
  StudioNameSchema,
} from "@/lib/validations/zod-schema/studio/studio-step-schema";

import { studioService } from "@/services/studio/StudioService";

export const saveDateSpecificHour = async (data: DateSpecificHourSchemaFormData, studioId: string) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //validate if the studio belong to the user

    //zod safe parse
    const validateFields = DateSpecificHourSchema.safeParse(data);
    if (!validateFields.success) {
      throw new ValidationError(validateFields.error.flatten().fieldErrors);
    }

    //save to database
    const result = await studioService.saveDateSpecificHour(data, studioId);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const deleteDateSpecificHour = async (date: string, studioId: string) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //validate if the studio belong to the user

    //save to database
    const result = await studioService.deleteDateSpecificHourByStudioId(date, studioId);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const createNewDraftStudio = async (data: StudioNameFormData, userId: string) => {
  try {
    /* --------------------- Validate if user has logged in --------------------- */
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    /* --------------------- Zod Safe Parse --------------------- */
    const validateFields = StudioNameSchema.safeParse(data);

    if (!validateFields.success) {
      throw new ValidationError(validateFields.error.flatten().fieldErrors);
    }

    const result = await studioService.createNewDraftStudio(data, userId);

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const saveBasicInfoForm = async (data: BasicInfoFormData, studioId: string, isOnboardingStep: boolean) => {
  try {
    /* --------------------- Validate if user has logged in --------------------- */
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //TODO validate if the studio belongs to the user

    //zod safe parse
    const validateFields = BasicInfoSchema.safeParse(data);

    if (!validateFields.success) {
      throw new ValidationError(validateFields.error.flatten().fieldErrors);
    }

    const result = await studioService.saveBasicInfo(data, studioId, isOnboardingStep);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const saveBusinessHoursAndPrice = async (data: BusinessHoursAndPriceFormData, studioId: string, isOnboardingStep: boolean) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //validate if the studio belong to the user

    //zod safe parse
    const validateFields = BusinessHoursAndPriceSchema.safeParse(data);
    if (!validateFields.success) {
      throw new ValidationError(validateFields.error.flatten().fieldErrors);
    }

    const result = await studioService.saveBusinessHoursAndPrice(data, studioId, isOnboardingStep);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const saveEquipment = async (data: EquipmentFormData, studioId: string, isOnboardingStep: boolean) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //validate if the studio belong to the user

    //zod safe parse
    const validateFields = EquipmentSchema.safeParse(data);
    if (!validateFields.success) {
      throw new ValidationError(validateFields.error.flatten().fieldErrors);
    }

    const result = await studioService.saveEquipment(data, studioId, isOnboardingStep);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const deleteGalleryImages = async (imageUrls: string[], studioId: string) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //validate if the studio belong to the user

    //save to database
    const result = await studioService.deleteGalleryImages(imageUrls, studioId);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const saveGallery = async (imageUrls: string[], studioId: string, isOnboardingStep: boolean) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    const result = await studioService.saveGallery(imageUrls, studioId, isOnboardingStep);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const saveDoorPassword = async (data: DoorPasswordFormData, studioId: string, isOnboardingStep: boolean) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    const result = await studioService.saveDoorPassword(data, studioId, isOnboardingStep);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const saveSocial = async (data: SocialFormData, studioId: string, isOnboardingStep: boolean) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //zod safe parse
    const validateFields = SocialSchema.safeParse(data);
    if (!validateFields.success) {
      throw new ValidationError(validateFields.error.flatten().fieldErrors);
    }

    const result = await studioService.saveSocial(data, studioId, isOnboardingStep);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const savePayoutInfo = async (data: PayoutFormData, studioId: string, isOnboardingStep: boolean) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //zod safe parse
    const validateFields = PayoutSchema.safeParse(data);
    if (!validateFields.success) {
      throw new ValidationError(validateFields.error.flatten().fieldErrors);
    }

    const result = await studioService.savePayoutInfo(data, studioId, isOnboardingStep);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const completeOnboardingApplication = async (data: OnboardingTermsFormData, studioId: string) => {
  try {
    //validate if user has logged in
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //zod safe parse
    const validateFields = OnboardingTermsSchema.safeParse(data);
    if (!validateFields.success) {
      throw new ValidationError(validateFields.error.flatten().fieldErrors);
    }

    const result = await studioService.completeStudioOnboardingApplication(data, studioId);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};
