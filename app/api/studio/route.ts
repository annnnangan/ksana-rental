import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { studioNameSchema } from "@/lib/validations";
import { studioService } from "@/services/studio/StudioService";
import { studioCreateService } from "@/services/StudioCreateService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const allStudiosName = await studioService.getAllStudiosName();

    return NextResponse.json(
      {
        success: true,
        data: allStudiosName.data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: "系統出現錯誤。" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedStudioName = studioNameSchema.safeParse(body);

    if (!validatedStudioName.success) {
      throw new ValidationError(
        validatedStudioName.error.flatten().fieldErrors
      );
    }
    const userId = 1;
    const createNewStudioResponse = await studioCreateService.createNewStudio(
      userId,
      body.name
    );

    if (createNewStudioResponse.success) {
      const studioId = createNewStudioResponse.data;
      const insertOnboardingStepsResponse =
        await studioCreateService.insertOnboardingSteps(studioId, userId);

      if (insertOnboardingStepsResponse.success) {
        return NextResponse.json(
          { success: true, data: createNewStudioResponse.data },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
