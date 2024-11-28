"use client";
import { Flex } from "@radix-ui/themes";
import React, { useState } from "react";
import Timeslot from "./Timeslot";
import { BookingQuery, timeslotInfo } from "../page";
import useBookingStore from "@/stores/BookingStore";
import { convertTimeToString } from "@/lib/date-time-utils";

interface Props {
  availableTimeslots: timeslotInfo[];
  searchParams: BookingQuery;
}

const TimeslotList = ({ availableTimeslots, searchParams }: Props) => {
  const {
    bookingInfo: { startTime },
    setBookingTime,
    setBookingPrice,
  } = useBookingStore();

  if (availableTimeslots.length == 0) {
    return <p>No available timeslots</p>;
  }

  return (
    <Flex gap="3" wrap="wrap">
      {availableTimeslots.map((time) => (
        <Timeslot
          key={searchParams.date + "" + time.start_time}
          isAvailable={time.isBooked ? false : true}
          priceType={time.price_type}
          startTime={convertTimeToString(time.start_time)}
          isSelected={startTime === time.start_time}
          onSelect={() => {
            setBookingPrice(time.price);
            setBookingTime(time.start_time);
          }}
        />
      ))}
    </Flex>
  );
};

export default TimeslotList;
