"use client";
import useBookingStore from "@/stores/BookingStore";
import { BookingQuery } from "../page";

const BookingDateTimeInfo = () => {
  const {
    bookingInfo: { bookingTime, bookingDate, bookingPrice },
  } = useBookingStore();
  return (
    <div>
      <p>Booking Date: {bookingDate}</p>
      <p>Booking Time: {bookingTime}</p>
      <p>Price:{bookingPrice} </p>
    </div>
  );
};

export default BookingDateTimeInfo;
