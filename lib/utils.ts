import {
  format,
  isAfter,
  isBefore,
  isWithinInterval,
  parse,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";

import { toZonedTime } from "date-fns-tz";

//Time format for backend - Get "00:00:00" from "00:00" or "0"
export function convertStringToTime(time: string | number) {
  if (typeof time == "number") {
    time = time + ":00";
  }
  let date = new Date(`01/01/2022 ${time}`);
  let formattedTime = date.toLocaleTimeString("en-US", { hour12: false });
  return formattedTime;
}

//Time format for frontend display - Get "00:00" from "00:00:00"
export function convertTimeToString(time: string) {
  // Split the input string by the colon ':'
  const [hours, minutes] = time.split(":");
  // Return formatted time as 'HH:MM'
  return `${hours}:${minutes}`;
}

//Time format for calculation - Get "22" from "22:00:00"
export function getHourFromTime(time: string, isEndTime: boolean) {
  let timeBreakdown = time.split(":").map(Number); //[0, 0, 0]
  if (isEndTime) {
    if (timeBreakdown[0] === 23 && timeBreakdown[1] === 59) {
      timeBreakdown = [24, 0, 0];
    }
  }
  return timeBreakdown[0];
}

//Calculate the end time by adding 1 hour to the start time
export function calculateBookingEndTime(startTime: string) {
  const bookingDurationInHour = 1;
  return parseInt(startTime.split(":")[0]) + bookingDurationInHour + ":00";
}

export function isPastDateTime(date: Date, time: string) {
  // Split the start time into hours, minutes, and seconds
  const [hours, minutes, seconds] = time.split(":").map(Number);

  // Combine selected date with start time
  const selectedDateTime = setSeconds(
    setMinutes(setHours(date, hours), minutes),
    seconds
  );

  // Get the current date-time in UTC+8 (HKT)
  const todayDate = new Date();
  const hktOffset = 8 * 60; // Offset for Hong Kong Time (HKT = UTC+8)
  const todayDateHKT = new Date(todayDate.getTime() + hktOffset * 60 * 1000);

  // Validate if selected date and time are in the past
  return isBefore(selectedDateTime, todayDate);
}

export function isPastDate(date: Date) {
  // Get the current date
  const today = new Date();
  // Set the time of today's date to midnight (start of the day)
  today.setHours(0, 0, 0, 0);

  // Set the time of the selected date to midnight (start of the day)
  const normalizedSelectedDate = new Date(date);
  normalizedSelectedDate.setHours(0, 0, 0, 0);

  // Compare the dates
  return normalizedSelectedDate < today;
}

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

//Format date for frontend
export function formatDate(date: Date) {
  const timeZone = "Asia/Hong_Kong";
  // Convert the input date to the HKT timezone
  const dateInHKT = toZonedTime(date, timeZone);
  // Format the date in HKT
  return format(dateInHKT, "yyyy-MM-dd");
}

//Return the maximum date that user could book
//2 months from the current month
export function maxBookingDate() {
  return new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0);
}
