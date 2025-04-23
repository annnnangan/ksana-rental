import handleError from "@/lib/handlers/error";
import { auth } from "@/lib/next-auth-config/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await auth();
    const userId = user?.user.id;

    return NextResponse.json({ success: true, data: userId ?? "" }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
