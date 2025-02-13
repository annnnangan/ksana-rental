"use server";

import handleError from "@/lib/handlers/error";
import { UnauthorizedError, ValidationError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { DateSpecificHoursSchema, DateSpecificHoursSchemaFormData } from "@/lib/validations/zod-schema/manage-studio-schema";
import { studioService } from "@/services/studio/StudioService";

export const saveDateSpecificHours = async (data: DateSpecificHoursSchemaFormData, studioId: string) => {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //zod safe parse
    const validateFields = DateSpecificHoursSchema.safeParse(data);
    if (!validateFields.success) {
      throw new ValidationError(validateFields.error.flatten().fieldErrors);
    }

    //save to database
    const result = await studioService.saveDateSpecificHours(data, studioId);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};
