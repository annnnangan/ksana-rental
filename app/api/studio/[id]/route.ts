import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { StudioOnBoardingTermsSchema } from "@/lib/validations";
import { studioService } from "@/services/StudioService";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const validatedData = StudioOnBoardingTermsSchema.safeParse(body.data);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const userId = 1;
    const response = await studioService.updateStudioStatus(
      Number(params.id),
      userId,
      "reviewing"
    );

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
