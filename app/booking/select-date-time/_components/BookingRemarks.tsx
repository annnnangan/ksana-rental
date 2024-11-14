import { TextArea, Text, Flex } from "@radix-ui/themes";
import React from "react";
import BookingTitle from "./BookingTitle";

const BookingRemarks = () => {
  return (
    <Flex direction="column" gap="2" maxWidth={{ sm: "100%", lg: "500px" }}>
      <BookingTitle>備註</BookingTitle>
      <TextArea size="2" placeholder="留下備註給商戶..." />
    </Flex>
  );
};

export default BookingRemarks;
