import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { studioNameSchema } from "@/lib/validations";
import { studioCreateService } from "@/services/StudioCreateService";
import { NextRequest, NextResponse } from "next/server";

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
    const response = await studioCreateService.createNewStudio(
      userId,
      body.name
    );

    if (response.success) {
      return NextResponse.json(
        { success: true, data: response.data },
        { status: 201 }
      );
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
