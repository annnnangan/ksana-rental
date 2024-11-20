import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { bookingSchema } from "@/lib/validations";
import { bookingService } from "@/services/BookingService";
import { NextRequest, NextResponse } from "next/server";

//Create Booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedDate = bookingSchema.safeParse(body);

    if (!validatedDate.success) {
      throw new ValidationError(validatedDate.error.flatten().fieldErrors);
    }

    const result = await bookingService.createBooking(validatedDate.data, 2);

    if (result.success) {
      let newBookingNumber = result.data;

      return NextResponse.json(
        { success: true, data: newBookingNumber },
        { status: 201 }
      );
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

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
