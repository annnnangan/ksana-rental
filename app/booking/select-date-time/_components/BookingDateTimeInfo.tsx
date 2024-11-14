"use client";
import useBookingStore from "@/stores/BookingStore";
import { Flex, Text } from "@radix-ui/themes";
import BookingTitle from "./BookingTitle";

const BookingDateTimeInfo = () => {
  const {
    bookingInfo: { bookingTime, bookingDate },
  } = useBookingStore();

  const endTime = parseInt(bookingTime.split(":")[0]) + 1 + ":00";
  return (
    <Flex direction="column" gap="2">
      <BookingTitle>租用日期及時間</BookingTitle>
      <p>日期: {bookingDate}</p>
      <p>時間: {bookingTime ? `${bookingTime} - ${endTime}` : "---"}</p>
    </Flex>
  );
};

export default BookingDateTimeInfo;
