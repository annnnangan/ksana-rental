"use client";

import convertToSubcurrency from "@/lib/utils/convert-to-subcurrency-utils";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

import { sendBookingConfirmation } from "@/actions/booking";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import SubmitButton from "../common/buttons/SubmitButton";
import LoadingSpinner from "../common/loading/LoadingSpinner";

interface Props {
  amount: number;
}

const CheckoutForm = ({ amount }: Props) => {
  const searchParams = useSearchParams();
  const bookingReferenceNumber = searchParams.get("booking");
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Create payment intent
  useEffect(() => {
    fetch("/api/booking/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: convertToSubcurrency(amount),
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  // User submit payment
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    try {
      const origin = window.location.origin;
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${origin}/booking/success`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error("系統錯誤，請重試。");
      }

      // Get Payment Status and Returned Stripe Payment ID
      const paymentStatus = result.paymentIntent.status;
      const stripePaymentId = result.paymentIntent.id;

      if (paymentStatus !== "succeeded") {
        throw new Error("付款失敗，請重試。");
      }

      // If payment is success, update the booking status to confirmed
      if (paymentStatus === "succeeded") {
        const response = await fetch(`/api/booking/payment/${bookingReferenceNumber}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus, stripePaymentId }),
        });
        const res = await response.json();
        // Redirect user to the success page
        if (res.success) {
          startTransition(() => sendBookingConfirmation(bookingReferenceNumber!));
          router.refresh();
          router.push(`/booking/success?booking=${bookingReferenceNumber}`);
        }
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "系統錯誤，請重試。";
      toast(errorMessage, {
        position: "bottom-right",
        type: "error",
        autoClose: 1000,
      });
      router.push(`/`);
    }
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return <LoadingSpinner height={"h-[100px]"} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      <SubmitButton
        isSubmitting={!stripe || loading || isPending}
        submittingText="付款處理中"
        nonSubmittingText={`付款HK$ ${amount}`}
        className="w-full"
      />
    </form>
  );
};

export default CheckoutForm;
