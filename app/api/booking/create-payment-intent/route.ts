import handleError from "@/lib/handlers/error";
import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const { price, bookingReferenceNumber } = await request.json();

    const userId = 2;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "hkd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        booking_reference_number: bookingReferenceNumber,
        userId: userId,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
