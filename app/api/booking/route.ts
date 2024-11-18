import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { bookingSchema } from "@/lib/validations";
import { bookingService } from "@/services/BookingService";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
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
