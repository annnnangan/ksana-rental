"use server";

import handleError from "@/lib/handlers/error";
import { UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { adminService } from "@/services/admin/AdminService";
import { payoutService } from "@/services/payout/PayoutService";

export const confirmStudioPayout = async (
  proofURLs: string[],
  payoutRecord: PayoutCompleteRecordType
) => {
  try {
    const session = await auth();

    //validate if user has logged in
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //validate if user is admin
    if (session && session.user.role !== "admin") {
      throw new UnauthorizedError("你沒有此權限。");
    }

    const result = await payoutService.createPayoutRecord(proofURLs, payoutRecord);

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const approveStudio = async (studioId: string) => {
  try {
    const session = await auth();

    //validate if user has logged in
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //validate if user is admin
    if (session && session.user.role !== "admin") {
      throw new UnauthorizedError("你沒有此權限。");
    }

    const result = await adminService.approveStudio(studioId);
    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const setRecommendStudios = async (studioList: Record<number, string>) => {
  try {
    const session = await auth();

    //validate if user has logged in
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //validate if user is admin
    if (session && session.user.role !== "admin") {
      throw new UnauthorizedError("你沒有此權限。");
    }

    const result = await adminService.setRecommendStudios(studioList);
    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};
