import { Flex } from "@radix-ui/themes";
import React from "react";
import SectionTitle from "./SectionTitle";
import { convertTimeToString, formatDate } from "@/lib/utils";

interface Props {
  bookingDate: Date;
  startTime: string;
  endTime: string;
}

const DateTimeInfo = ({ bookingDate, startTime, endTime }: Props) => {
  return (
    <Flex direction="column" gap="2">
      <SectionTitle>租用日期及時間</SectionTitle>
      <p>日期: {formatDate(bookingDate)}</p>
      <p>
        時間:{" "}
        {startTime
          ? `${convertTimeToString(startTime)} - ${convertTimeToString(
              endTime
            )}`
          : "---"}
      </p>
    </Flex>
  );
};

export default DateTimeInfo;