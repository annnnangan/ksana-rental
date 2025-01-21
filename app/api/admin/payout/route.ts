import handleError from "@/lib/handlers/error";
import { payoutService } from "@/services/studio/PayoutService";
import { NextRequest, NextResponse } from "next/server";
import { differenceInDays, getDay, isValid, parseISO } from "date-fns";

function isValidDate(dateString: string) {
  const parsedDate = parseISO(dateString);
  return isValid(parsedDate) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

//Get Payout Overview Data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const payoutStartDate = searchParams.get("startDate");
    const payoutEndDate = searchParams.get("endDate");

    //Validate if all date parameter is presented
    if (!payoutStartDate || !payoutEndDate)
      return NextResponse.json(
        {
          success: false,
          error: { message: "Missing payout start or end date." },
        },
        { status: 422 }
      );

    //Validate date format
    if (!isValidDate(payoutStartDate) || !isValidDate(payoutEndDate))
      return NextResponse.json(
        { success: false, message: "Invalid date format." },
        { status: 422 }
      );

    //Validate if it is a valid date range
    //todo - start date = monday
    //todo - end date = sunday and the difference between should be 6
    if (
      getDay(new Date(payoutStartDate)) !== 1 ||
      getDay(new Date(payoutEndDate)) !== 0 ||
      differenceInDays(new Date(payoutEndDate), new Date(payoutStartDate)) !== 6
    ) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid payout date range." } },
        { status: 422 }
      );
    }

    const totalPayoutAmountResponse = await payoutService.getTotalPayoutAmount(
      payoutStartDate,
      payoutEndDate
    );

    const allStudiosPayoutOverviewDataResponse =
      await payoutService.getStudioPayoutOverview(
        payoutStartDate,
        payoutEndDate
      );

    if (
      totalPayoutAmountResponse.success &&
      allStudiosPayoutOverviewDataResponse.success
    ) {
      return NextResponse.json(
        {
          success: true,
          data: {
            ...totalPayoutAmountResponse.data,
            studios_payout_list: allStudiosPayoutOverviewDataResponse.data,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: "系統出現錯誤。" } },
      { status: 500 }
    );
  }
}
