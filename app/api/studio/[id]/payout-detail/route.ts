import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { StudioPayoutSchema } from "@/lib/validations";
import { studioCreateService } from "@/services/StudioCreateService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const validatedData = StudioPayoutSchema.safeParse(body.data);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const userId = 1;
    const response = await studioCreateService.savePayoutDetail(
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
