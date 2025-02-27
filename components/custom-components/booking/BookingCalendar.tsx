"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";

import { Calendar } from "@/components/shadcn/calendar";
import { Button } from "@/components/shadcn/button";
import Timeslot from "./Timeslot";
import { PriceType } from "@/services/model";
import useBookingStore from "@/stores/BookingStore";

const timeslotsResult = [
  {
    time: 9,
    is_booked: true,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: 10,
    is_booked: false,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: 11,
    is_booked: false,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: 12,
    is_booked: false,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: 13,
    is_booked: false,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: 14,
    is_booked: false,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: 22,
    is_booked: false,
    price: 100,
    price_type: "peak",
  },
  {
    time: 23,
    is_booked: false,
    price: 100,
    price_type: "peak",
  },
];

const BookingCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startMonth, setStartMonth] = useState<Date>();
  const [endMonth, setEndMonth] = useState<Date>();

  const {
    bookingInfo: { startTime, price },
    setBookingTime,
    setBookingPrice,
  } = useBookingStore();

  useEffect(() => {
    // Get today's date
    const today = new Date();
    // Calculate the start and end months
    setStartMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setEndMonth(new Date(today.getFullYear(), today.getMonth() + 3, 0));
  }, []);

  return (
    <div className="flex flex-col space-y-5 md:flex-row md:justify-center md:space-x-12">
      <div className="flex justify-center">
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" initialFocus disabled={{ before: new Date() }} fromMonth={startMonth} toMonth={endMonth} />
      </div>
      <div className="space-y-7">
        <div className="flex md:flex-row items-start flex-wrap">
          {priceType.map((type) => (
            <div key={type.label} className="flex justify-center items-center me-4">
              <div className={classNames(type.bgColor, "rounded-full", "w-3", "h-3", "me-2")}></div>
              <p className={classNames(type.textColor)}>{type.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
          {timeslotsResult.map((time) => (
            <Timeslot
              key={time.time}
              isBooked={time.is_booked}
              priceType={time.price_type as PriceType}
              startTime={time.time}
              isSelected={startTime === time.time.toString()}
              onSelect={() => {
                setBookingPrice(time.price);
                setBookingTime(time.time.toString());
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;

// React Query to Fetch timeslots
const useBookingTimeslots = (selectedStudioSlug: string, selectedDate: string) => {
  useQuery({
    queryKey: ["timeslots", selectedStudioSlug, selectedDate],
    queryFn: async () => {
      const res = await fetch(`/api/studio`);
      const result = await res.json();
      return result.data as { name: string; slug: string }[];
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    enabled: !!selectedStudioSlug && !!selectedDate, // Only fetch when both studioId and date are present
  });
};

const priceType = [
  { label: "非繁忙時間", bgColor: "bg-green-500", textColor: "text-green-500" },
  { label: "繁忙時間", bgColor: "bg-orange-600", textColor: "text-orange-600" },
  {
    label: "已被預約",
    bgColor: "bg-gray-400",
    textColor: "text-gray-400",
  },
];
