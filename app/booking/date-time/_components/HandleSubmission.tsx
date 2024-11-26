"use client";
import useBookingStore from "@/stores/BookingStore";
import { Button, Flex, Spinner } from "@radix-ui/themes";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils";
import SubmissionButtons from "../../_components/SubmissionButtons";

const HandleSubmission = () => {
  const { bookingInfo } = useBookingStore();
  const [isCreatingBooking, setCreatingBooking] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setCreatingBooking(true);
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingInfo),
      });

      if (!response.ok) {
        // If the response status is not 2xx, throw an error with the response message
        const errorData = await response.json();
        throw new Error(
          errorData?.error.message ||
            "An error occurred while submitting the booking."
        );
      }

      const result = await response.json();

      router.push(
        `/booking/terms-and-conditions?booking=${result.data["reference_no"]}`
      );
      router.refresh();
    } catch (error) {
      setCreatingBooking(false);
      const formattedDate = formatDate(bookingInfo.date);
      const errorMessage =
        (error as Error).message || "An unexpected error occurred.";
      router.push(
        `/booking/date-time?studio=${bookingInfo.studio}&date=${formattedDate}`
      );
      router.refresh();
      toast(errorMessage, {
        position: "bottom-right",
        type: "error",
        autoClose: 1000,
      });
    }
  };

  return (
    <SubmissionButtons
      handleClick={handleClick}
      isLoading={isCreatingBooking}
    />
  );
};

export default HandleSubmission;
