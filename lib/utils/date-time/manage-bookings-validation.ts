import { convertTimeToString } from "@/lib/utils/date-time/format-time-utils";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { TZDate } from "@date-fns/tz";
import { differenceInMinutes, parse } from "date-fns";

export function validateDoorPasswordAvailability(booking_date: Date, booking_start_time: string) {
  const timeZone = "Asia/Hong_Kong";

  const bookingDateTime = formatDate(new Date(booking_date)) + " " + convertTimeToString(booking_start_time);

  const formattedBookingDateTime = parse(bookingDateTime, "yyyy-MM-dd HH:mm", new Date());

  const now = new TZDate(new Date(), timeZone);

  const timeDifferenceInMinutes = differenceInMinutes(formattedBookingDateTime, now);

  const isAvailable = timeDifferenceInMinutes >= 0 && timeDifferenceInMinutes <= 120;

  return isAvailable;
}

export function validateCancelBookingAvailability(booking_status: string, booking_date: Date, booking_start_time: string) {
  const timeZone = "Asia/Hong_Kong";
  const isConfirmed = booking_status === "confirmed";

  const bookingDateTime = formatDate(new Date(booking_date)) + " " + convertTimeToString(booking_start_time);

  const formattedBookingDateTime = parse(bookingDateTime, "yyyy-MM-dd HH:mm", new Date());

  const now = new TZDate(new Date(), timeZone);

  const timeDifferenceInMinutes = differenceInMinutes(formattedBookingDateTime, now);

  const dayInMinutes = 24 * 60;

  const is24HoursBefore = timeDifferenceInMinutes >= dayInMinutes; // 24 hours in milliseconds

  const isAvailable = isConfirmed && is24HoursBefore;

  return isAvailable;
}

export function validateCanLeaveBookingReview(has_reviewed: boolean, booking_status: string, booking_date: Date, booking_start_time: string) {
  const timeZone = "Asia/Hong_Kong";

  const isCompleted = booking_status === "completed";

  const bookingDateTime = formatDate(new Date(booking_date)) + " " + convertTimeToString(booking_start_time);

  const formattedBookingDateTime = parse(bookingDateTime, "yyyy-MM-dd HH:mm", new Date());

  const now = new TZDate(new Date(), timeZone);

  const timeDifferenceInMinutes = differenceInMinutes(now, formattedBookingDateTime);

  const sevenDaysInMinutes = 7 * 24 * 60;

  // The review can only be submitted if the booking has started and is within 7 days
  const canLeaveReview =
    isCompleted &&
    !has_reviewed &&
    timeDifferenceInMinutes >= 0 && //booking has started
    timeDifferenceInMinutes <= sevenDaysInMinutes; //is within 7 days

  return canLeaveReview;
}
