import { Box, Button, Flex } from "@radix-ui/themes";
import React from "react";
import BookingDateTimeInfo from "./BookingDateTimeInfo";
import BookingStudioInfo from "./BookingStudioInfo";
import { BookingQuery } from "../page";
import BookingPrice from "./BookingPrice";
import BookingRemarks from "./BookingRemarks";

interface Props {
  searchParams: BookingQuery;
}

const BookingInfo = ({ searchParams }: Props) => {
  return (
    <Flex direction="column" gap="5">
      <BookingStudioInfo searchParams={searchParams} />
      <BookingDateTimeInfo />
      <BookingPrice />
      <BookingRemarks />
      <Flex gap="4">
        <Button size="2">
          <p className="px-8">確定</p>
        </Button>

        <Button variant="outline">
          <p className="px-8">返回</p>
        </Button>
      </Flex>
    </Flex>
  );
};

export default BookingInfo;
