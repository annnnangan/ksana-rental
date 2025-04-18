import handleError from "@/lib/handlers/error";
import { studioService } from "@/services/studio/StudioService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await studioService.getRecommendStudios();

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.dir(error);
    return handleError(error, "api") as APIErrorResponse;
  }
}
