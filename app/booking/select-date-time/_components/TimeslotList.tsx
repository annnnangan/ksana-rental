"use client";
import { Flex } from "@radix-ui/themes";
import React, { useState } from "react";
import Timeslot from "./Timeslot";
import { BookingQuery, timeslotInfo } from "../page";
import useBookingStore from "@/stores/BookingStore";

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
          startTime={`${time.start_time.toString().padStart(2, "0")}:00`}
          isSelected={
            startTime === `${time.start_time.toString().padStart(2, "0")}:00`
          }
          onSelect={() => {
            setBookingPrice(time.price);
            setBookingTime(`${time.start_time.toString().padStart(2, "0")}:00`);
          }}
        />
      ))}
    </Flex>
  );
};

export default TimeslotList;
