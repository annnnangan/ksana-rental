import handleError from "@/lib/handlers/error";
import { studioService } from "@/services/studio/StudioService";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userInputSlug = searchParams.get("slug");

    if (userInputSlug) {
      const result = await studioService.checkIsSlugExist(userInputSlug);
      if (result.data) {
        return NextResponse.json(
          { success: false, error: { message: "此網站別名已被使用，請輸入其他別名。" } },
          { status: 201 }
        );
      } else {
        return NextResponse.json({ success: true }, { status: 201 });
      }
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
