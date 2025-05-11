import handleError from "@/lib/handlers/error";
import { UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { dashboardService } from "@/services/Dashboard/DashboardService";
import { validateStudioService } from "@/services/studio/ValidateStudio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const params = await props.params;
    const user = await auth();
    const studioId = params.idOrSlug;
    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get("dateRange") || "last-6-months";

    if (!user?.user.id) {
      throw new UnauthorizedError("請先登入。");
    }

    const isStudioBelongUserResponse =
      await validateStudioService.validateIsStudioBelongToUser(
        user?.user.id,
        studioId
      );

    if (!isStudioBelongUserResponse.success) {
      throw new UnauthorizedError("無權儲取此場地資料。");
    }

    if (isStudioBelongUserResponse.success) {
      const dateType: "booking_date" | "created_at" = "booking_date";
      const [
        bookingCountResponse,
        revenueResponse,
        payoutResponse,
        upcoming5BookingsResponse,
      ] = await Promise.all([
        dashboardService.getStudioBookingCount({
          timeframe,
          dateType,
          studioId,
        }),
        dashboardService.getStudioExpectedRevenue({
          timeframe,
          dateType,
          studioId,
        }),
        dashboardService.getStudioPayout({ timeframe, studioId }),
        dashboardService.getUpcoming5Bookings({ studioId }),
      ]);
      // From Gordon: Didn't handle failed case.
      if (
        revenueResponse.success &&
        bookingCountResponse.success &&
        payoutResponse.success &&
        upcoming5BookingsResponse.success
      ) {
        return NextResponse.json(
          {
            success: true,
            data: {
              expectedRevenue: revenueResponse.data,
              bookingCount: bookingCountResponse.data,
              payout: payoutResponse.data,
              upcoming5Bookings: upcoming5BookingsResponse.data,
            },
          },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
