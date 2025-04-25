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
import { BookingFormData } from "@/lib/validations/zod-schema/booking-schema";
import {
  reviewBookingSchema,
  reviewFormData,
} from "@/lib/validations/zod-schema/review-booking-schema";
import { bookingService } from "@/services/booking/BookingService";

export const createPendingForPaymentBooking = async (data: BookingFormData) => {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    const userId = session?.user?.id;

    //Create a pending for payment booking
    const result = await bookingService.createPendingForPaymentBooking(data, userId);

    if (!result?.success) {
      return result as ErrorResponse;
    }

    return { success: true, data: result.data };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const createConfirmedForFreeBooking = async (data: BookingFormData) => {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    const userId = session?.user?.id;

    //Create a pending for payment booking
    const pendingPaymentResult = await bookingService.createPendingForPaymentBooking(data, userId);

    if (!pendingPaymentResult?.success) {
      return pendingPaymentResult as ErrorResponse;
    }

    const confirmedBookingResult = await bookingService.updateBookingStatusToConfirmed(
      pendingPaymentResult.data.reference_no,
      userId
    );

    if (!confirmedBookingResult?.success) {
      return confirmedBookingResult as ErrorResponse;
    }

    return { success: true, data: pendingPaymentResult.data };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const cancelBooking = async ({
  bookingReferenceNo,
  role,
  studioId,
}: {
  bookingReferenceNo: string;
  role: "user" | "studio";
  studioId?: string;
}) => {
  try {
    if (!bookingReferenceNo) {
      throw new NotFoundError("預約");
    }

    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    //TODO - Check if user id and the studio id belong

    //Get booking reference date and start time
    const { date, start_time, status } = (
      await bookingService.getBookingInfoByReferenceNo(bookingReferenceNo)
    )?.data;

    //check if it is 24 hours before

    const couldCancel = validateCancelBookingAvailability(status, date, start_time);

    if (!couldCancel) {
      throw new ForbiddenError("此預約已超過24小時，無法取消。");
    }

    let result;

    if (role === "user") {
      result = await bookingService.cancelBookingAndRefundCredit({
        bookingReferenceNo: bookingReferenceNo,
        role: "user",
        userId: session?.user?.id,
      });
    }

    if (role === "studio") {
      result = await bookingService.cancelBookingAndRefundCredit({
        bookingReferenceNo: bookingReferenceNo,
        role: "studio",
        studioId: studioId,
      });
    }

    if (!result?.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};

export const reviewBooking = async (bookingReferenceNo: string, data: reviewFormData) => {
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

    const response = await bookingService.submitBookingReview(
      bookingReferenceNo,
      session?.user.id,
      data
    );

    if (!response.success) {
      return response;
    }

    return { success: true };
  } catch (error) {
    return handleError(error, "server") as ActionResponse;
  }
};
