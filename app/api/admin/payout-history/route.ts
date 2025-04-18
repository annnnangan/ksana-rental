import handleError from "@/lib/handlers/error";
import { UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { payoutService } from "@/services/payout/PayoutService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (session?.user.role !== "admin") {
      throw new UnauthorizedError("你沒有此權限。");
    }

    const payoutHistoryResponse = await payoutService.getAllPayoutHistory();

    if (payoutHistoryResponse.success) {
      return NextResponse.json(
        {
          success: true,
          data: payoutHistoryResponse.data,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
