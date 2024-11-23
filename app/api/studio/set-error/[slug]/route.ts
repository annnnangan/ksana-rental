import { bookingService } from "@/services/BookingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (params.slug) {
    const studioResult = await bookingService.isStudioExist(params.slug);
    if (studioResult.success) {
      return NextResponse.json({ isExist: true });
    } else {
      return NextResponse.json({ isExist: false });
    }
  } else {
    return NextResponse.json({ isExist: false });
  }
}
