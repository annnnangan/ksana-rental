import { GENERAL_ERROR_MESSAGE, UNAUTHORIZED_ACCESS_MESSAGE } from "@/lib/constants/error-message";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { StudioDoorPasswordSchema } from "@/lib/validations/zod-schema/booking-schema";
import { bookingService } from "@/services/booking/BookingService";
import { studioCreateService } from "@/services/StudioCreateService";
import { NextRequest, NextResponse } from "next/server";

//GET Door Password
export async function GET(request: NextRequest, props: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const params = await props.params;
    const studioId = params.idOrSlug;
    const session = await auth();

    const searchParams = request.nextUrl.searchParams;
    const bookingReferenceNumber = searchParams.get("booking");

    if (!bookingReferenceNumber) {
      return NextResponse.json({ success: false, message: "預約不存在。" }, { status: 404 });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: UNAUTHORIZED_ACCESS_MESSAGE }, { status: 401 });
    }

    // const isBookingBelongUser =
    //   await validateBookingService.validateIsBookingBelongUser(
    //     bookingReferenceNumber,
    //     session?.user?.id
    //   );

    // if (!isBookingBelongUser.success) {
    //   return NextResponse.json(
    //     { success: false, message: isBookingBelongUser.error?.message },
    //     { status: isBookingBelongUser.errorStatus }
    //   );
    // }

    const result = await bookingService.getDoorPasswordForBooking(studioId);

    if (!result?.success) {
      return NextResponse.json({ success: false, error: { message: result?.error?.message } }, { status: result?.errorCode });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: { message: GENERAL_ERROR_MESSAGE } }, { status: 500 });
  }
}
