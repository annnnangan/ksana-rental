"use client";
import useBookingStore from "@/stores/BookingStore";
import { Flex, Text } from "@radix-ui/themes";
import BookingTitle from "./BookingTitle";

const BookingDateTimeInfo = () => {
  const {
    bookingInfo: { startTime, date },
  } = useBookingStore();

  const endTime = parseInt(startTime.split(":")[0]) + 1 + ":00";
  return (
    <Flex direction="column" gap="2">
      <BookingTitle>租用日期及時間</BookingTitle>
      <p>日期: {date}</p>
      <p>時間: {startTime ? `${startTime} - ${endTime}` : "---"}</p>
    </Flex>
  );
};

export default BookingDateTimeInfo;
