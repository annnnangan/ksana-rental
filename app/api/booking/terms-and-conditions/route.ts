import handleError from "@/lib/handlers/error";
import { bookingService } from "@/services/BookingService";
import { NextRequest, NextResponse } from "next/server";

//Update Booking's is_accept_tnc value to true
export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bookingReferenceNumber = searchParams.get("booking");
    const userId = 2;

    if (!bookingReferenceNumber) {
      throw new Error("找不到預約參考編號。");
    }

    if (bookingReferenceNumber) {
      await bookingService.updateIsAcceptTnCValue(
        bookingReferenceNumber,
        userId
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
