"use client";
import useBookingStore from "@/stores/BookingStore";
import { addMonths, format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { toast } from "react-toastify";

const Calendar = () => {
  const router = useRouter();
  // Get the query string
  const searchParams = useSearchParams();
  const { resetBookingTime, setBookingDate, resetBookingPrice } =
    useBookingStore();
  const dateQueryString = searchParams.get("date");

  useEffect(() => {
    setBookingDate(
      dateQueryString === null
        ? format(new Date(), "yyyy-MM-dd")
        : format(new Date(dateQueryString!), "yyyy-MM-dd")
    );
    // Checking the past date
    function isDateTodayOrPast(dateStr: string) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
      const dateToCheck = new Date(dateStr);
      dateToCheck.setHours(0, 0, 0, 0); // Reset time for accurate comparison
      if (dateToCheck < today) {
        toast("invalid date!", {
          position: "top-center",
          theme: "colored",
          type: "error",
          autoClose: 1000,
        });
        router.replace(
          `/booking/select-date-time?studio=${searchParams.get(
            "studio"
          )}&date=${format(new Date(), "yyyy-MM-dd")}`
        );
        setSelected(new Date());
      }
    }
    if (dateQueryString) {
      isDateTodayOrPast(dateQueryString);
    }
  }, [dateQueryString, setBookingDate]);

  // Set the selected date from query string / today's date
  const [selectedDate, setSelected] = useState<Date>(
    dateQueryString === null ? new Date() : new Date(dateQueryString!)
  );

  // Set selected date to query string when user select date
  const handleDateSelect = (date: Date) => {
    if (date) {
      setSelected(date);
      //reset booking time and price on screen when user select another date
      resetBookingTime();
      resetBookingPrice();
      // Format the date to 'YYYY-MM-DD'
      const formattedDate = format(date, "yyyy-MM-dd");

      // Set the query string
      const params = new URLSearchParams();
      if (searchParams.get("studio"))
        params.append("studio", searchParams.get("studio")!);
      params.append("date", formattedDate);
      const query = params.size ? "?" + params.toString() : "";
      router.push("/booking/select-date-time" + query);
    }
  };

  return (
    <DayPicker
      required
      className="mb-10"
      mode="single"
      selected={selectedDate}
      onSelect={handleDateSelect}
      disabled={{ before: new Date() }}
      defaultMonth={new Date(selectedDate)}
      startMonth={new Date(new Date().getFullYear(), new Date().getMonth())}
      endMonth={new Date(new Date().getFullYear(), new Date().getMonth() + 2)}
    />
  );
};

export default Calendar;
