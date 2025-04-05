import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";
import { validatePayoutDates } from "@/lib/utils/date-time/payout-date-validation";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { payoutService } from "@/services/payout/PayoutService";
import { differenceInDays, getDay, isValid, parseISO } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

function isValidDate(dateString: string) {
  const parsedDate = parseISO(dateString);
  return isValid(parsedDate) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

//Get Payout Data
export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const payoutStartDate = searchParams.get("startDate");
    const payoutEndDate = searchParams.get("endDate");
    const params = await props.params;
    const studioSlug = params.slug;

    // 🔍 Validate if all date parameter is presented
    if (!payoutStartDate || !payoutEndDate) {
      throw new ForbiddenError("Missing payout date range.");
    }

    // 🔍 Validate date format
    if (!isValidDate(payoutStartDate) || !isValidDate(payoutEndDate)) {
      throw new ForbiddenError("Invalid payout date.");
    }

    // 🔍 Validate if it is a valid date range
    if (getDay(new Date(payoutStartDate)) !== 1 || getDay(new Date(payoutEndDate)) !== 0 || differenceInDays(new Date(payoutEndDate), new Date(payoutStartDate)) !== 6) {
      throw new ForbiddenError("Invalid payout date range.");
    }

    const [completedBookingListResponse, disputeTransactionListResponse] = await Promise.all([
      payoutService.getStudioCompletedBookingList(payoutStartDate, payoutEndDate, studioSlug),
      payoutService.getStudioDisputeTransactionList(payoutStartDate, payoutEndDate, studioSlug),
    ]);

    if (completedBookingListResponse.success && disputeTransactionListResponse.success) {
      return NextResponse.json(
        {
          success: true,
          data: {
            completedBookingList: completedBookingListResponse.data,
            disputeTransactionList: disputeTransactionListResponse.data,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
