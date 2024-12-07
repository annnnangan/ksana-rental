"use client";

import ToastMessage from "@/app/_components/ToastMessageWithRedirect";
import convertToSubcurrency from "@/lib/utils/convert-to-subcurrency-utils";
import { Box, Button, Flex, Spinner } from "@radix-ui/themes";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
interface Props {
  price: number;
  bookingReferenceNumber: string;
}

const CheckoutForm = ({ price, bookingReferenceNumber }: Props) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/booking/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: convertToSubcurrency(price),
        bookingReferenceNumber: bookingReferenceNumber,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [price]);

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
          return_url: `${origin}/booking/payment-success`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error("系統錯誤，請重試。");
      }

      const paymentStatus = result.paymentIntent.status;
      const stripePaymentId = result.paymentIntent.id;

      if (paymentStatus !== "succeeded") {
        throw new Error("付款失敗，請重試。");
      }

      if (paymentStatus === "succeeded") {
        const response = await fetch(
          `/api/booking/payment/${bookingReferenceNumber}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentStatus, stripePaymentId }),
          }
        );
        const res = await response.json();
        if (res.success) {
          router.refresh();
          router.push(
            `/booking/payment-success?booking=${bookingReferenceNumber}`
          );
        }
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "系統錯誤，請重試。";
      toast(errorMessage, {
        position: "bottom-right",
        type: "error",
        autoClose: 1000,
      });
      router.refresh();
    }
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <Flex display="flex" justify="center" align="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      {errorMessage && <div>{errorMessage}</div>}

      <Box mt="5">
        <Button disabled={!stripe || loading} style={{ width: "100%" }}>
          {!loading ? (
            `Pay $${price}`
          ) : (
            <Spinner loading>Processing...</Spinner>
          )}
        </Button>
      </Box>
    </form>
  );
};

export default CheckoutForm;
