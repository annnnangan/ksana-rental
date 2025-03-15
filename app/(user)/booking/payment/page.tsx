"use client";

import convertToSubcurrency from "@/lib/utils/convert-to-subcurrency-utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";

import CheckoutForm from "@/components/custom-components/booking/CheckoutForm";
import LoadingSpinner from "@/components/custom-components/loading/LoadingSpinner";
import SectionTitle from "@/components/custom-components/studio-details/SectionTitle";
import { useSessionUser } from "@/hooks/use-session-user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const BookingPaymentPage = () => {
  //Get User Session
  const user = useSessionUser();
  //Get Reference No from query string
  const searchParams = useSearchParams();
  const bookingReferenceNumber = searchParams.get("booking");
  const router = useRouter();
  //Use State
  const [actualPayment, setActualPayment] = useState<number | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getActualPayment = async () => {
      try {
        setLoading(true);
        const actualPaymentResponse = await fetch(`/api/booking/payment/${bookingReferenceNumber}?userId=${user?.id}`);
        const actualPaymentResult = await actualPaymentResponse.json();

        if (!actualPaymentResult.success) {
          toast(actualPaymentResult.error.message, {
            position: "top-right",
            type: "error",
            autoClose: 1000,
          });
          router.push("/");
          return;
        } else {
          setActualPayment(Number(actualPaymentResult.data.actual_payment));
        }
      } catch (error) {
        // @ts-ignore
        toast(error.message, {
          position: "top-right",
          type: "error",
          autoClose: 1000,
        });
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      getActualPayment();
    }
  }, [user]);

  return (
    <>
      <SectionTitle>付款</SectionTitle>
      {isLoading ? (
        <LoadingSpinner height={"h-[100px]"} />
      ) : (
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(actualPayment as number),
            currency: "hkd",
          }}
        >
          <CheckoutForm amount={actualPayment as number} />
        </Elements>
      )}
    </>
  );
};

export default BookingPaymentPage;
