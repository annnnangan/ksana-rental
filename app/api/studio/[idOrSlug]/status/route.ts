import handleError from "@/lib/handlers/error";
import { UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { studioService } from "@/services/studio/StudioService";
import { validateStudioService } from "@/services/studio/ValidateStudio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const params = await props.params;
    const user = await auth();
    const studioId = params.idOrSlug;

    if (!user?.user.id) {
      throw new UnauthorizedError("請先登入。");
    }

    if (user.user.role === "user") {
      const isStudioBelongUserResponse = await validateStudioService.validateIsStudioBelongToUser(
        user?.user.id,
        studioId
      );

      if (!isStudioBelongUserResponse.success) {
        throw new UnauthorizedError("無權儲取此場地資料。");
      }
    }

    //admin & studio owner could access this api
    const result = await studioService.getStudioStatus(studioId);

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.dir(error);
    return handleError(error, "api") as APIErrorResponse;
  }
}
