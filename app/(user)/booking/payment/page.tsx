import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentPageContent from "./PaymentPageContent";

const STRIPE_API = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

const page = () => {
  return <PaymentPageContent STRIPE_API={STRIPE_API!} />;
};

export default page;
