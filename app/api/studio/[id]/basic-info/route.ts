import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { studioBasicInfoSchema } from "@/lib/validations";
import { studioCreateService } from "@/services/StudioCreateService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const validatedBasicInfo = studioBasicInfoSchema.safeParse(body.data);
    if (!validatedBasicInfo.success) {
      throw new ValidationError(validatedBasicInfo.error.flatten().fieldErrors);
    }

    const userId = 1;
    const response = await studioCreateService.saveBasicInfo(
      Number(params.id),
      userId,
      body.data
    );

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
