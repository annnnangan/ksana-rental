import { payoutService } from "@/services/studio/PayoutService";
import { differenceInDays, getDay, isValid, parseISO } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

function isValidDate(dateString: string) {
  const parsedDate = parseISO(dateString);
  return isValid(parsedDate) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

//Get Payout Overview Data
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const slug = params.slug;
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

    const allStudiosPayoutOverviewDataResponse =
      await payoutService.getStudioPayoutOverview(
        payoutStartDate,
        payoutEndDate,
        slug
      );

    if (!allStudiosPayoutOverviewDataResponse.success) {
      return NextResponse.json(
        {
          success: false,
          error: allStudiosPayoutOverviewDataResponse.error,
        },
        { status: allStudiosPayoutOverviewDataResponse.errorCode }
      );
    }

    if (allStudiosPayoutOverviewDataResponse.success) {
      return NextResponse.json(
        {
          success: true,
          data: {
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
