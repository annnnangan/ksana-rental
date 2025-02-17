"use server";

import handleError from "@/lib/handlers/error";
import { UnauthorizedError, ValidationError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { DateSpecificHourSchema, DateSpecificHourSchemaFormData } from "@/lib/validations/zod-schema/studio/studio-manage-schema";
import { BasicInfoFormData, BasicInfoSchema, BusinessHoursAndPriceFormData, BusinessHoursAndPriceSchema } from "@/lib/validations/zod-schema/studio/studio-step-schema";

import { studioService } from "@/services/studio/StudioService";
import { FieldValues } from "react-hook-form";
import { ZodType } from "zod";

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
