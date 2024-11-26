"use client";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

interface Props {
  price: number;
  bookingReferenceNumber: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const StripeWrapper = ({ price, bookingReferenceNumber }: Props) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubcurrency(price),
        currency: "hkd",
      }}
    >
      <CheckoutForm
        price={price}
        bookingReferenceNumber={bookingReferenceNumber}
      />
    </Elements>
  );
};

export default StripeWrapper;
