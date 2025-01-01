import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { studioBusinessHourAndPriceSchema } from "@/lib/validations";
import { studioCreateService } from "@/services/StudioCreateService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: number }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const userId = 1;

    const validatedData = studioBusinessHourAndPriceSchema.safeParse(body.data);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const savePriceResponse = await studioCreateService.savePrice(
      Number(params.id),
      userId,
      body.data
    );

    if (!savePriceResponse.success) {
      return new Error();
    }

    const saveBusinessHoursResponse =
      await studioCreateService.saveBusinessHours(
        Number(params.id),
        userId,
        body.data
      );

    if (savePriceResponse.success && saveBusinessHoursResponse.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
