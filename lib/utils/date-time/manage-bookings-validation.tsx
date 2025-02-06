import {
  convertTimeToString,
  formatDate,
} from "@/lib/utils/date-time/date-time-utils";
import { TZDate } from "@date-fns/tz";
import { differenceInMinutes, parse } from "date-fns";

export function validateDoorPasswordAvailability(
  booking_date: Date,
  booking_start_time: string
) {
  const timeZone = "Asia/Hong_Kong";

  const bookingDateTime =
    formatDate(new Date(booking_date)) +
    " " +
    convertTimeToString(booking_start_time);

  const formattedBookingDateTime = parse(
    bookingDateTime,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  const now = new TZDate(new Date(), timeZone);

  const timeDifferenceInMinutes = differenceInMinutes(
    formattedBookingDateTime,
    now
  );

  const isAvailable =
    timeDifferenceInMinutes >= 0 && timeDifferenceInMinutes <= 120;

  return isAvailable;
}

export function validateCancelBookingAvailability(
  booking_status: string,
  booking_date: Date,
  booking_start_time: string
) {
  const timeZone = "Asia/Hong_Kong";
  const isConfirmed = booking_status === "confirmed";

  const bookingDateTime =
    formatDate(new Date(booking_date)) +
    " " +
    convertTimeToString(booking_start_time);

  const formattedBookingDateTime = parse(
    bookingDateTime,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  const now = new TZDate(new Date(), timeZone);

  const timeDifferenceInMinutes = differenceInMinutes(
    formattedBookingDateTime,
    now
  );

  const dayInMinutes = 24 * 60;

  const is24HoursBefore = timeDifferenceInMinutes >= dayInMinutes; // 24 hours in milliseconds

  const isAvailable = isConfirmed && is24HoursBefore;

  return isAvailable;
}
