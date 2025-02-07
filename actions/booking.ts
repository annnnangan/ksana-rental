"use server";

import handleError from "@/lib/handlers/error";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { validateCancelBookingAvailability } from "@/lib/utils/date-time/manage-bookings-validation";
import { bookingService } from "@/services/BookingService";

export const cancelBooking = async (bookingReferenceNo: string) => {
  try {
    if (!bookingReferenceNo) {
      throw new NotFoundError("預約");
    }

    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //Get booking reference date and start time
    const { date, start_time, status } = (
      await bookingService.getBookingInfoByReferenceNo(bookingReferenceNo)
    )?.data;

    //check if it is 24 hours before

    const couldCancel = validateCancelBookingAvailability(
      status,
      date,
      start_time
    );

    if (!couldCancel) {
      throw new ForbiddenError("此預約已超過24小時，無法取消。");
    }

    const result = await bookingService.cancelBookingAndRefundCredit(
      bookingReferenceNo,
      session?.user.id
    );

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};
