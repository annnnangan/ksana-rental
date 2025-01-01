import handleError from "@/lib/handlers/error";
import { studioCreateService } from "@/services/StudioCreateService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  try {
    const params = await props.params;
    const { imageType, imageUrl } = await request.json();
    const userId = 1;
    const response = await studioCreateService.saveImage(
      Number(params.id),
      userId,
      imageType,
      imageUrl
    );

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
