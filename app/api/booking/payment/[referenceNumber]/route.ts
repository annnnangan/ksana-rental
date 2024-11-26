import handleError from "@/lib/handlers/error";
import { bookingService } from "@/services/BookingService";
import { NextRequest, NextResponse } from "next/server";

//Update Status to Confirm
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ referenceNumber: string }> }
) {
  try {
    const params = await props.params;
    const { paymentStatus, stripePaymentId } = await request.json();

    console.log(`Inside route.ts + ${paymentStatus} + ${stripePaymentId}`);

    if (paymentStatus !== "succeeded") {
      throw new Error("付款失敗，請重試。");
    }

    if (paymentStatus === "succeeded") {
      const result = await bookingService.updateConfirmBooking(
        params.referenceNumber,
        2,
        stripePaymentId
      );

      console.log(`Result form route: ${result}`);

      if (result.success) {
        return NextResponse.json({ success: true }, { status: 201 });
      } else {
        throw new Error("系統錯誤，請重試。");
      }
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
