"use client";
import useBookingStore from "@/stores/BookingStore";
import { Button, Flex } from "@radix-ui/themes";
import React from "react";
import { createBooking } from "../_utils/actions";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

const HandleSubmission = () => {
  const { bookingInfo } = useBookingStore();
  const router = useRouter();

  return (
    <Flex gap="4">
      <Button
        size="2"
        onClick={async () => {
          const result = await createBooking(bookingInfo, 2);
          if (result.success) {
            router.push(
              `/booking/accept-tnc?booking=${result.data["reference_no"]}`
            );
          } else {
            router.push(
              `/booking/select-date-time?studio=${bookingInfo.studio}&date=${bookingInfo.date}`
            );
          }
        }}
      >
        <p className="px-8">確定</p>
      </Button>

      <Button variant="outline">
        <p className="px-8">返回</p>
      </Button>
    </Flex>
  );
};

export default HandleSubmission;
