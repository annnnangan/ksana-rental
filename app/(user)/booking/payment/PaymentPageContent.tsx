"use client";

import convertToSubcurrency from "@/lib/utils/convert-to-subcurrency-utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";

import CheckoutForm from "@/components/custom-components/booking/CheckoutForm";
import LoadingSpinner from "@/components/custom-components/common/loading/LoadingSpinner";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PaymentPageContent = ({ STRIPE_API, userId }: { STRIPE_API: string; userId: string }) => {
  const stripePromise = loadStripe(STRIPE_API);
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
        const actualPaymentResponse = await fetch(`/api/booking/payment/${bookingReferenceNumber}`);
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
        //@ts-expect-error expected
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
    if (userId) {
      getActualPayment();
    }
  }, [userId, bookingReferenceNumber, router]);

  console.log("client component - PaymentPageContent - actualPayment", actualPayment);

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

export default PaymentPageContent;
