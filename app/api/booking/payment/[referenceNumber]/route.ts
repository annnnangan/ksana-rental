import handleError from "@/lib/handlers/error";
import { ForbiddenError, UnauthorizedError } from "@/lib/http-errors";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { bookingService } from "@/services/booking/BookingService";
import { NextRequest, NextResponse } from "next/server";

// GET Booking Information By Reference No For Payment
export async function GET(request: NextRequest, props: { params: Promise<{ referenceNumber: string }> }) {
  try {
    const bookingReference = (await props.params).referenceNumber;

    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const userId = queryParams.get("userId");

    if (!userId) {
      throw new ForbiddenError("請先登入才可預約。");
    }

    const response = await bookingService.getBookingInfoForPayment(bookingReference, userId!);

    if (!response.success) {
      return handleError(response, "api") as APIErrorResponse;
    }

    return NextResponse.json({ success: true, data: response.data }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

//Update Status to Confirm
export async function PATCH(request: NextRequest, props: { params: Promise<{ referenceNumber: string }> }) {
  try {
    const params = await props.params;
    const { paymentStatus, stripePaymentId } = await request.json();
    const user = await sessionUser();

    console.log(`Inside route.ts + ${paymentStatus} + ${stripePaymentId}`);

    if (paymentStatus !== "succeeded") {
      throw new ForbiddenError("付款失敗，請重試。");
    }

    if (!user) {
      throw new UnauthorizedError("請先登入。");
    }

    if (paymentStatus === "succeeded") {
      const result = await bookingService.updateBookingStatusToConfirmed(params.referenceNumber, user?.id, stripePaymentId);

      console.log(`Result form route: ${result}`);

      if (result.success) {
        return NextResponse.json({ success: true }, { status: 201 });
      } else {
        throw new ForbiddenError("系統錯誤，請重試。");
      }
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
