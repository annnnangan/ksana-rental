import handleError from "@/lib/handlers/error";
import { UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { payoutService } from "@/services/payout/PayoutService";
import { validateStudioService } from "@/services/studio/ValidateStudio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const params = await props.params;
    const user = await auth();
    const studioId = params.idOrSlug;
    const searchParams = request.nextUrl.searchParams;
    const payoutStartDate = searchParams.get("startDate") || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

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
      const result = await payoutService.getStudioPayoutRecordList({
        studioId,
        page,
        limit,
        payoutStartDate,
      });

      return NextResponse.json(
        {
          success: true,
          data: result.data,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.dir(error);
    return handleError(error, "api") as APIErrorResponse;
  }
}
