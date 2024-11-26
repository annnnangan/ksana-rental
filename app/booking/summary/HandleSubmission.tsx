"use client";
import React, { useState } from "react";
import SubmissionButtons from "../_components/SubmissionButtons";
import { useRouter, useSearchParams } from "next/navigation";

import useBookingStore from "@/stores/BookingStore";
import { toast } from "react-toastify";

const HandleSubmission = () => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const {
    bookingInfo: { whatsapp, remarks },
  } = useBookingStore();
  const searchParams = useSearchParams();
  const bookingReferenceNumber = searchParams.get("booking");
  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/booking/summary/${bookingReferenceNumber}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ whatsapp, remarks }),
        }
      );

      if (!response.ok) {
        // If the response status is not 2xx, throw an error with the response message
        const errorData = await response.json();
        throw new Error(errorData?.error.message || "系統發生未預期錯誤。");
      }

      router.push(`/booking/payment?booking=${bookingReferenceNumber}`);
      router.refresh();
    } catch (error) {
      setLoading(false);

      const errorMessage =
        (error as Error).message || "An unexpected error occurred.";
      router.push(`/booking/summary?booking=${bookingReferenceNumber}`);
      router.refresh();
      toast(errorMessage, {
        position: "bottom-right",
        type: "error",
        autoClose: 1000,
      });
    }
  };

  return <SubmissionButtons handleClick={handleClick} isLoading={isLoading} />;
};

export default HandleSubmission;
