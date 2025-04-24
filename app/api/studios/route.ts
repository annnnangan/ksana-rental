import handleError from "@/lib/handlers/error";
import { auth } from "@/lib/next-auth-config/auth";
import { studioService } from "@/services/studio/StudioService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await auth();
    const searchParams = request.nextUrl.searchParams;
    const selectedDistrict = searchParams.get("district") || "";
    const selectedEquipment = searchParams.get("equipment") || "";
    const selectedDate = searchParams.get("date") || "";
    const selectedStartTime = searchParams.get("startTime") || "";

    const result = await studioService.getStudioBasicInfo({
      status: "active",
      page: 1,
      limit: 5,
      district: selectedDistrict,
      equipment: selectedEquipment,
      date: selectedDate,
      startTime: selectedStartTime,
      userId: user?.user.id,
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.dir(error);
    return handleError(error, "api") as APIErrorResponse;
  }
}
