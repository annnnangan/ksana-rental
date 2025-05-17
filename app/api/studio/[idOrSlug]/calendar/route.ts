import handleError from "@/lib/handlers/error";
import { RequestError, UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { bookingService } from "@/services/booking/BookingService";
import { validateStudioService } from "@/services/studio/ValidateStudio";
import { lastDayOfWeek, startOfWeek } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const params = await props.params;
    const user = await auth();
    const studioId = params.idOrSlug;
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || formatDate(startOfWeek(new Date()));
    const endDate = searchParams.get("endDate") || formatDate(lastDayOfWeek(new Date()));

    if (!user?.user.id) {
      throw new UnauthorizedError("請先登入。");
    }

    const isStudioBelongUserResponse = await validateStudioService.validateIsStudioBelongToUser(
      user?.user.id,
      studioId
    );

    if (!isStudioBelongUserResponse.success) {
      throw new UnauthorizedError("無權儲取此場地資料。");
    }

    if (isStudioBelongUserResponse.success) {
      const bookingRecords = await bookingService.getConfirmBookingByWeek({
        startDate,
        endDate,
        studioId,
      });

      if (bookingRecords.success) {
        return NextResponse.json(
          {
            success: true,
            data: bookingRecords.data,
          },
          { status: 201 }
        );
      } else {
        throw new RequestError(500, "發生未知錯誤");
      }
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
