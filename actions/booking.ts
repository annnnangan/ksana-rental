"use server";

import handleError from "@/lib/handlers/error";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import {
  validateCancelBookingAvailability,
  validateCanLeaveBookingReview,
} from "@/lib/utils/date-time/manage-bookings-validation";
import {
  reviewBookingSchema,
  reviewFormData,
} from "@/lib/validations/zod-schema/review-booking-schema";
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

export const reviewBooking = async (
  bookingReferenceNo: string,
  data: reviewFormData
) => {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    if (!bookingReferenceNo) {
      throw new NotFoundError("預約");
    }

    const validatedDate = reviewBookingSchema.safeParse(data);

    if (!validatedDate.success) {
      throw new ValidationError(validatedDate.error.flatten().fieldErrors);
    }

    //Get booking reference date and start time
    const { date, start_time, status, has_reviewed } = (
      await bookingService.getBookingInfoByReferenceNo(bookingReferenceNo)
    )?.data;

    //check if it is after the booking date and time
    //check if it is within 7 days after the booking date and time
    const canLeaveBookingReview: boolean = validateCanLeaveBookingReview(
      has_reviewed,
      status,
      date,
      start_time
    );

    if (!canLeaveBookingReview) {
      throw new ForbiddenError("無法評論，因為評論需於預約開始後7天內進行。");
    }

    console.log("Database....");

    const response = await bookingService.submitBookingReview(
      bookingReferenceNo,
      session?.user.id,
      data
    );

    console.log("Database Response....");

    if (!response.success) {
      return response;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};
