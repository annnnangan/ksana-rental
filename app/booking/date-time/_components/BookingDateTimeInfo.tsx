"use client";
import useBookingStore from "@/stores/BookingStore";
import { Flex, Text } from "@radix-ui/themes";
import SectionTitle from "../../_components/SectionTitle";
import {
  calculateBookingEndTime,
  convertTimeToString,
  formatDate,
} from "@/lib/utils";

const BookingDateTimeInfo = () => {
  const {
    bookingInfo: { startTime, date },
  } = useBookingStore();

  const endTime = calculateBookingEndTime(startTime);

  return (
    <Flex direction="column" gap="2">
      <SectionTitle>租用日期及時間</SectionTitle>
      <p>日期: {formatDate(date)}</p>
      <p>
        時間:{" "}
        {startTime ? `${convertTimeToString(startTime)} - ${endTime}` : "---"}
      </p>
    </Flex>
  );
};

export default BookingDateTimeInfo;
