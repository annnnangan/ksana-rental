// middleware.ts

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next(); // Proceed with the request

  const url = request.nextUrl.clone();
  const origin = request.nextUrl.origin;
  const studioQueryString = url.searchParams.get("studio");
  const bookingReferenceNumberQueryString = url.searchParams.get("booking");

  if (url.pathname === "/booking/date-time" && !studioQueryString) {
    response.cookies.set("error", "請選擇場地才可開始預約。");
  }

  if (studioQueryString) {
    const data = await fetch(
      `${origin}/api/studio/set-error/${studioQueryString}`
    );

    const res = await data.json();

    if (res.isExist === false) {
      response.cookies.set("error", "你所選擇之場地不存在。");
    }
  }

  if (
    !bookingReferenceNumberQueryString &&
    (url.pathname === "/booking/terms-and-conditions" ||
      url.pathname === "/booking/summary")
  ) {
    response.cookies.set("error", "缺少預約編號。");
  }

  if (bookingReferenceNumberQueryString) {
    const data = await fetch(
      `${origin}/api/booking/set-error/${bookingReferenceNumberQueryString}`
    );

    const res = await data.json();

    if (!res.success) {
      response.cookies.set("error", res.error.message);
    }
  }

  return response;
}
