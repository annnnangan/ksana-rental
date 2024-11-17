"use client";
import { formatDate, maxBookingDate } from "@/lib/utils";
import useBookingStore from "@/stores/BookingStore";
import { compareAsc, format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { toast } from "react-toastify";

const Calendar = () => {
  //Reset the time and price when new date is selected
  const { resetBookingTime, setBookingDate, resetBookingPrice, setStudio } =
    useBookingStore();
  const router = useRouter();
  // Get the query string
  const searchParams = useSearchParams();
  const dateQueryString = searchParams.get("date");
  const studioQueryString = searchParams.get("studio");

  useEffect(() => {
    studioQueryString
      ? setStudio(studioQueryString)
      : router.replace("/studio");

    // Checking if date is valid
    // Date is not valid when (1) the date is in the past and (2) the selected date exceed the max calendar month
    function isDateValid(dateStr: string) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
      const dateToCheck = new Date(dateStr);
      dateToCheck.setHours(0, 0, 0, 0); // Reset time for accurate comparison

      const maxBookedMonth = maxBookingDate();

      let isInvalidDate = false;

      if (
        dateToCheck < today ||
        compareAsc(dateToCheck, maxBookedMonth) > 0 ||
        isNaN(Date.parse(dateStr)) == true
      ) {
        isInvalidDate = true;
        toast("日期無效。", {
          position: "bottom-right",
          type: "error",
          autoClose: 1000,
        });
      }

      if (isInvalidDate) {
        router.replace(
          `/booking/select-date-time?studio=${searchParams.get(
            "studio"
          )}&date=${format(new Date(), "yyyy-MM-dd")}`
        );
        setSelected(new Date());
      }
    }

    if (dateQueryString) {
      isDateValid(dateQueryString);
    }

    setBookingDate(
      dateQueryString === null ? new Date() : new Date(dateQueryString!)
    );
  }, [dateQueryString, setBookingDate]);

  // Set the selected date from query string / today's date
  const [selectedDate, setSelected] = useState<Date>(
    dateQueryString === null ? new Date() : new Date(dateQueryString)
  );

  // Set selected date to query string when user select date
  const handleDateSelect = (date: Date) => {
    if (date) {
      setSelected(date);
      //reset booking time and price on screen when user select another date
      resetBookingTime();
      resetBookingPrice();
      // Format the date to 'YYYY-MM-DD'
      const formattedDate = formatDate(date);

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
      endMonth={maxBookingDate()}
    />
  );
};

export default Calendar;
