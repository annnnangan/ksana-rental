"use client";
import useBookingStore from "@/stores/BookingStore";
import { Flex, Radio, Text } from "@radix-ui/themes";
import SectionTitle from "../../_components/SectionTitle";

const BookingDateTimeInfo = () => {
  const {
    bookingInfo: { price },
  } = useBookingStore();
  return (
    <Flex gap="2">
      <div>
        <SectionTitle>付款方式</SectionTitle>
        <Flex asChild gap="2">
          <Text as="label" size="3">
            <Radio size="2" name="payment" value="credit-card" defaultChecked />
            信用卡
          </Text>
        </Flex>
      </div>
      <div className="ms-auto">
        <div className="text-end">
          <SectionTitle>價錢</SectionTitle>
        </div>
        <p className="text-2xl">HK$ {price == 0 ? "---" : price}</p>
      </div>
    </Flex>
  );
};

export default BookingDateTimeInfo;
