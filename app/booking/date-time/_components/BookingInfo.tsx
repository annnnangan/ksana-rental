import { Box, Button, Flex } from "@radix-ui/themes";
import React from "react";
import BookingDateTimeInfo from "./BookingDateTimeInfo";
import BookingStudioInfo from "./BookingStudioInfo";
import { BookingQuery } from "../page";
import BookingPrice from "./BookingPrice";
import BookingInput from "./BookingInput";
import HandleSubmission from "./HandleSubmission";

interface Props {
  searchParams: BookingQuery;
}

const BookingInfo = ({ searchParams }: Props) => {
  return (
    <Flex direction="column" gap="5">
      <BookingStudioInfo searchParams={searchParams} />
      <BookingDateTimeInfo />
      <BookingPrice />
      <BookingInput />
      <HandleSubmission />
    </Flex>
  );
};

export default BookingInfo;
