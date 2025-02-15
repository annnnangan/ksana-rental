import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { bookingPhoneRemarksSchema } from "@/lib/validations/zod-schema/booking-schema";
import { bookingService } from "@/services/BookingService";
import { NextRequest, NextResponse } from "next/server";

//Update Phone / Remarks
export async function PATCH(request: NextRequest, props: { params: Promise<{ referenceNumber: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();

    const validatedDate = bookingPhoneRemarksSchema.safeParse(body);

    if (!validatedDate.success) {
      throw new ValidationError(validatedDate.error.flatten().fieldErrors);
    }

    const result = await bookingService.updatePhoneRemarks(params.referenceNumber, 2, validatedDate.data);

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
