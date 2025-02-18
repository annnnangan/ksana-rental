import handleError from "@/lib/handlers/error";
import { studioService } from "@/services/studio/StudioService";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;

    const response = await studioService.getOnboardingStepStatus(params.id);

    if (response.success) {
      return NextResponse.json({ success: true, data: response.data }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: number }> }) {
  try {
    const params = await props.params;
    const body = await request.json();

    const userId = 1;
    const response = await studioService.completeOnboardingStep(Number(params.id), userId, body.onboardingStep);

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
