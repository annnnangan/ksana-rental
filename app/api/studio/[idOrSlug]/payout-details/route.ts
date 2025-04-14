import handleError from "@/lib/handlers/error";
import { ForbiddenError, UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { payoutService } from "@/services/payout/PayoutService";
import { validateStudioService } from "@/services/studio/ValidateStudio";
import { differenceInDays, getDay, isAfter, startOfDay, startOfWeek, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const params = await props.params;
    const user = await auth();
    const studioId = params.idOrSlug;
    const searchParams = request.nextUrl.searchParams;
    const payoutStartDate = searchParams.get("startDate");
    const payoutEndDate = searchParams.get("endDate");

    if (!user?.user.id) {
      throw new UnauthorizedError("請先登入。");
    }

    if (!payoutStartDate || !payoutEndDate) {
      throw new ForbiddenError("請先選擇結算時段。");
    }

    const isValid =
      payoutStartDate &&
      payoutEndDate &&
      getDay(payoutStartDate) === 1 &&
      getDay(payoutEndDate) === 0 &&
      differenceInDays(payoutEndDate, payoutStartDate) === 6;

    const maxAllowedEndDate = startOfDay(subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 8));
    const isEndWithinRange = !isAfter(startOfDay(payoutEndDate), maxAllowedEndDate);
    const isDateRangeValid = isValid && isEndWithinRange;

    if (!isDateRangeValid) {
      throw new ForbiddenError("請選擇有效的結算時段");
    }

    const isStudioBelongUserResponse = await validateStudioService.validateIsStudioBelongToUser(
      user?.user.id,
      studioId
    );

    if (!isStudioBelongUserResponse.success) {
      throw new UnauthorizedError("無權儲取此場地資料。");
    }

    if (isStudioBelongUserResponse.success) {
      const [payoutOverviewResult, completedBookingList, disputeTransactionList] =
        await Promise.all([
          payoutService.getStudioPayoutOverviewByDate({ studioId, payoutStartDate, payoutEndDate }),
          payoutService.getStudioCompletedBookingList(payoutStartDate, payoutEndDate, studioId),
          payoutService.getStudioDisputeTransactionList(payoutStartDate, payoutEndDate, studioId),
        ]);

      if (
        payoutOverviewResult.success &&
        completedBookingList.success &&
        disputeTransactionList.success
      ) {
        return NextResponse.json(
          {
            success: true,
            data: {
              payoutOverviewData: payoutOverviewResult.data,
              completedBookingList: completedBookingList.data,
              disputeTransactionList: disputeTransactionList.data,
            },
          },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    console.dir(error);
    return handleError(error, "api") as APIErrorResponse;
  }
}
