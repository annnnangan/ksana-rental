import handleError from "@/lib/handlers/error";
import { auth } from "@/lib/next-auth-config/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!);
    const { price, bookingReferenceNumber } = await request.json();
    const user = await auth();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "hkd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        booking_reference_number: bookingReferenceNumber,
        userId: user?.user.id,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
