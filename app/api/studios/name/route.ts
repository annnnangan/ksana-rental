import handleError from "@/lib/handlers/error";
import { studioService } from "@/services/studio/StudioService";
import { NextRequest, NextResponse } from "next/server";

// Get all studio name
export async function GET(request: NextRequest) {
  try {
    const result = await studioService.getAllStudiosName();
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.dir(error);
    return handleError(error, "api") as APIErrorResponse;
  }
}
