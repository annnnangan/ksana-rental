import handleError from "@/lib/handlers/error";
import { UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { dashboardService } from "@/services/Dashboard/DashboardService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== "admin") {
      throw new UnauthorizedError("你沒有此權限。");
    }

    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get("dateRange") || "last-6-months";

    const [userCountResponse, bookingCountResponse, activeStudioCountResponse, bookingRevenueResponse, top5BookingStudioResponse] = await Promise.all([
      dashboardService.getUserCount({ timeframe }),
      dashboardService.getBookingCount({ timeframe }),
      dashboardService.getActiveStudioCount({ timeframe }),
      dashboardService.getBookingRevenue({ timeframe }),
      dashboardService.getTop5BookingStudios({ timeframe }),
    ]);

    if (userCountResponse.success && bookingCountResponse.success && activeStudioCountResponse.success && bookingRevenueResponse.success && top5BookingStudioResponse.success) {
      return NextResponse.json(
        {
          success: true,
          data: {
            userCount: userCountResponse.data,
            bookingCount: bookingCountResponse.data,
            activeStudioCount: activeStudioCountResponse.data,
            bookingRevenue: bookingRevenueResponse.data,
            top5BookingStudio: top5BookingStudioResponse.data,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
