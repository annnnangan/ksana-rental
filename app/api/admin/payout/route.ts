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
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const payoutStartDate = searchParams.get("startDate");
    const payoutEndDate = searchParams.get("endDate");
    const studio = searchParams.get("slug") || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const payoutMethod = ["fps", "payme", "bank-transfer"].includes(searchParams.get("payoutMethod") || "undefined") ? searchParams.get("payoutMethod") : undefined;
    const payoutStatus = ["pending", "complete"].includes(searchParams.get("payoutStatus") || "undefined") ? searchParams.get("payoutStatus") : undefined;
    const orderBy = ["studioId", "studioName", "payoutStatus", "payoutMethod", "payoutAmount", "payoutAction"].includes(searchParams.get("orderBy") || "undefined")
      ? searchParams.get("orderBy")
      : "studioId";
    const orderDirection = ["asc", "desc"].includes(searchParams.get("orderDirection") || "undefined") ? searchParams.get("orderDirection") : "asc";

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

    const totalPayoutResponse = await payoutService.getWeeklyTotalPayout({ payoutStartDate, payoutEndDate });

    const studioPayoutResponse = await payoutService.getWeeklyStudiosPayout({
      payoutStartDate,
      payoutEndDate,
      slug: studio,
      payoutMethod: payoutMethod || undefined,
      status: payoutStatus || undefined,
      orderBy: orderBy || "studioId",
      orderDirection: orderDirection || "asc",
      page: page,
      limit: limit,
    });

    if (totalPayoutResponse.success && studioPayoutResponse.success) {
      return NextResponse.json(
        {
          success: true,
          data: {
            totalPayout: totalPayoutResponse.data,
            studioPayoutList: studioPayoutResponse.data,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    //validate if the payout range is correct
    const payoutDateValidationResponse = validatePayoutDates(body.payoutStartDate, body.payoutEndDate);

    if (!payoutDateValidationResponse.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: payoutDateValidationResponse.error?.message },
        },
        { status: 422 }
      );
    }

    const response = await payoutService.createPayoutRecord(body as PayoutCompleteRecordType);

    if (!response.success) return NextResponse.json({ success: false, error: { message: response.error?.message } }, { status: response.errorStatus });

    return NextResponse.json({ success: true, data: response.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: "系統出現錯誤。" } }, { status: 500 });
  }
}
