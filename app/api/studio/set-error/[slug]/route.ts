import { bookingService } from "@/services/booking/BookingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
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
