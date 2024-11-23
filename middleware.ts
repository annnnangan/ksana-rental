// middleware.ts

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next(); // Proceed with the request

  const url = request.nextUrl.clone();
  const origin = request.nextUrl.origin;
  const studioQueryString = url.searchParams.get("studio");
  if (url.pathname === "/booking/date-time" && !studioQueryString) {
    response.cookies.set("error", "true");
  }

  if (studioQueryString) {
    const data = await fetch(
      `${origin}/api/studio?studio=${studioQueryString}`
    );

    const res = await data.json();

    if (res.isExist === false) {
      response.cookies.set("error", "true");
    }
  }

  return response;
}
