import handleError from "@/lib/handlers/error";
import { studioService } from "@/services/studio/StudioService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const params = await props.params;
    const studioSlug = params.idOrSlug;
    const searchParams = request.nextUrl.searchParams;
    const currentPage = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    const result = await studioService.getStudioReview(studioSlug, currentPage, limit);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
