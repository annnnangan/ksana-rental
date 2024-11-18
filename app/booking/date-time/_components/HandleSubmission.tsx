"use client";
import useBookingStore from "@/stores/BookingStore";
import { Button, Flex } from "@radix-ui/themes";
import React from "react";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils";

const HandleSubmission = () => {
  const { bookingInfo } = useBookingStore();
  const router = useRouter();

  const handleClick = async () => {
    try {
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
      console.log(error);
      const formattedDate = formatDate(bookingInfo.date);
      const errorMessage =
        (error as Error).message || "An unexpected error occurred.";
      router.push(
        `/booking/date-time?studio=${bookingInfo.studio}&date=${formattedDate}`
      );
      toast(errorMessage, {
        position: "bottom-right",
        type: "error",
        autoClose: 1000,
      });
    }
  };

  return (
    <Flex gap="4">
      <Button size="2" onClick={handleClick}>
        <p className="px-8">確定</p>
      </Button>

      <Button variant="outline">
        <p className="px-8">返回</p>
      </Button>
    </Flex>
  );
};

export default HandleSubmission;
