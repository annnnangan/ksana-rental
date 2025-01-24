import { payoutService } from "@/services/payout/PayoutService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { payoutId, imageUrl } = await request.json();

    const response = await payoutService.createPayoutProofRecord({
      payout_id: payoutId,
      proof_image_url: imageUrl,
    });

    return NextResponse.json(
      { success: true, data: response.data },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: "系統出現錯誤。" } },
      { status: 500 }
    );
  }
}
