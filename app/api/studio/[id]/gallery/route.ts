import handleError from "@/lib/handlers/error";
import { studioCreateService } from "@/services/StudioCreateService";
import { studioService } from "@/services/StudioService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  try {
    const params = await props.params;
    const { imageUrl } = await request.json();
    const userId = 1;
    const response = await studioCreateService.saveGallery(
      Number(params.id),
      userId,
      imageUrl
    );

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  try {
    const params = await props.params;
    const userId = 1;
    const body = await request.json();
    const response = await studioService.removeGalleryImage(
      Number(params.id),
      userId,
      body
    );

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
