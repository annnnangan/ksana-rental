import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { studioContactSchema } from "@/lib/validations";
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

    console.log(body.data)

    const validatedData = studioContactSchema.safeParse(body.data);
 
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }



    const response = await studioCreateService.saveSocial(
      Number(params.id),
      userId,
      body.data
    );

  
    if (!response.success) {
      return new Error();
    }

    if (response.success) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
