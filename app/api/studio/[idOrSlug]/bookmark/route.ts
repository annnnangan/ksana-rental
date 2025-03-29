import handleError from "@/lib/handlers/error";
import { UnauthorizedError } from "@/lib/http-errors";
import { auth } from "@/lib/next-auth-config/auth";
import { userService } from "@/services/user/UserService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const params = await props.params;
    const studioSlug = params.idOrSlug;
    const session = await auth();
    if (!session?.user.id) {
      throw new UnauthorizedError("請先登入後才可處理。");
    }

    const response = await userService.getUserIndividualStudioBookmark(session.user.id, studioSlug);

    if (response?.success) {
      return NextResponse.json({ success: true, data: response.data }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
