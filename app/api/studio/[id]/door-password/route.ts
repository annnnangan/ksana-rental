import {
  GENERAL_ERROR_MESSAGE,
  UNAUTHORIZED_ACCESS_MESSAGE,
} from "@/lib/constants/error-message";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { StudioDoorPasswordSchema } from "@/lib/validations";
import { studioService } from "@/services/studio/StudioService";
import { studioCreateService } from "@/services/StudioCreateService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const validatedData = StudioDoorPasswordSchema.safeParse(body.data);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const userId = 1;
    const response = await studioCreateService.saveDoorPassword(
      Number(params.id),
      userId,
      body.data
    );

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

//GET Door Password
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const studioId = params.id;
    const session = await auth();

    const searchParams = request.nextUrl.searchParams;
    const bookingReferenceNumber = searchParams.get("booking");

    if (!bookingReferenceNumber) {
      return NextResponse.json(
        { success: false, message: "預約不存在。" },
        { status: 404 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: UNAUTHORIZED_ACCESS_MESSAGE },
        { status: 401 }
      );
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

    const result = await studioService.getDoorPassword(studioId);

    if (!result?.success) {
      return NextResponse.json(
        { success: false, error: { message: result?.error?.message } },
        { status: result?.errorCode }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { message: GENERAL_ERROR_MESSAGE } },
      { status: 500 }
    );
  }
}
