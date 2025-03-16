import { format, getDay, isAfter, isBefore, isWithinInterval, parse, parseISO, setHours, setMinutes, setSeconds, subDays } from "date-fns";

import { formatInTimeZone } from "date-fns-tz";

export function isTimeInRange(bookingTime: string, timeRanges: any[]) {
  // Parse the target time as a Date object (use today’s date to create a valid Date)
  const targetDate = parse(bookingTime, "HH:mm:ss", new Date());

  return timeRanges.some(({ open_time, end_time }) => {
    // Parse open and end times
    const openDate = parse(open_time, "HH:mm:ss", new Date());
    const endDate = parse(end_time, "HH:mm:ss", new Date());

    // Check if the target time is within the range
    if (isBefore(openDate, endDate)) {
      return isWithinInterval(targetDate, { start: openDate, end: endDate });
    } else {
      // Handle the case when the range spans over midnight
      return isAfter(targetDate, openDate) || isBefore(targetDate, endDate);
    }
  });
}

//Return the maximum date that user could book
//2 months from the current month
export function maxBookingDate() {
  return new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0);
}

export function getLastMonday(date: Date): Date {
  const dayOfWeek = getDay(date); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days since last Monday

  const mondayDate = subDays(date, daysToSubtract);

  return mondayDate;
}
