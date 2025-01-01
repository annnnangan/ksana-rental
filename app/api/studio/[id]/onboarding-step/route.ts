import handleError from "@/lib/handlers/error";
import { studioService } from "@/services/StudioService";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();

    const userId = 1;
    const response = await studioService.completeOnboardingStep(
      Number(params.id),
      userId,
      body.onboardingStep
    );

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
