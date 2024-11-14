"use client";
import useBookingStore from "@/stores/BookingStore";
import { Flex, Radio, Text } from "@radix-ui/themes";
import BookingTitle from "./BookingTitle";

const BookingDateTimeInfo = () => {
  const {
    bookingInfo: { bookingPrice },
  } = useBookingStore();
  return (
    <Flex gap="2">
      <div>
        <BookingTitle>付款方式</BookingTitle>
        <Flex asChild gap="2">
          <Text as="label" size="3">
            <Radio size="2" name="payment" value="credit-card" defaultChecked />
            信用卡
          </Text>
        </Flex>
      </div>
      <div className="ms-auto">
        <div className="text-end">
          <BookingTitle>價錢</BookingTitle>
        </div>
        <p className="text-2xl">
          HK$ {bookingPrice == 0 ? "---" : bookingPrice}
        </p>
      </div>
    </Flex>
  );
};

export default BookingDateTimeInfo;
