import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { bookingService } from "@/services/BookingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ referenceNumber: string }> }
) {
  const params = await props.params;
  try {
    if (!params.referenceNumber) {
      throw new NotFoundError("此預約");
    }

    const bookingStatusResult = await bookingService.getBookingStatus(
      params.referenceNumber,
      2
    );

    if (bookingStatusResult.data !== "pending for payment") {
      throw new Error("此預約已過期或已完成，請重新預約。");
    }

    if (!bookingStatusResult.success) {
      throw new NotFoundError("此預約");
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
