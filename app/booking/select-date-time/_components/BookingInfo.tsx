import { Flex } from "@radix-ui/themes";
import React from "react";
import BookingDateTimeInfo from "./BookingDateTimeInfo";
import BookingStudioInfo from "./BookingStudioInfo";
import { BookingQuery } from "../page";

interface Props {
  searchParams: BookingQuery;
}

const BookingInfo = ({ searchParams }: Props) => {
  return (
    <Flex direction="column" gap="5">
      <BookingStudioInfo searchParams={searchParams} />
      <BookingDateTimeInfo searchParams={searchParams} />
    </Flex>
  );
};

export default BookingInfo;
