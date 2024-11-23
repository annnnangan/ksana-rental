import { bookingService } from "@/services/BookingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const studioQueryString = searchParams.get("studio");

  if (studioQueryString) {
    const studioResult = await bookingService.isStudioExist(studioQueryString);
    if (studioResult.success) {
      return NextResponse.json({ isExist: true });
    } else {
      return NextResponse.json({ isExist: false });
    }
  } else {
    return NextResponse.json({ isExist: false });
  }
}
