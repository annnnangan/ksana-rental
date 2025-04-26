import handleError from "@/lib/handlers/error";
import { studioService } from "@/services/studio/StudioService";
import { NextRequest, NextResponse } from "next/server";

// Get all studio name for filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studioStatus = searchParams.get("status") || "all";
    const result = await studioService.getAllStudiosName({
      status: studioStatus as "all" | "active",
    });
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
