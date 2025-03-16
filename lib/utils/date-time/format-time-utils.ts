import { isAfter, isBefore, isWithinInterval, parse } from "date-fns";

/* -------------------------- 🕚 Time Format Utils -------------------------- */

//Frontend to Backend - Get "00:00:00" from "00:00" or "0"
export function convertStringToTime(time: string | number) {
  if (typeof time == "number") {
    time = time + ":00";
  }
  let date = new Date(`01/01/2022 ${time}`);
  let formattedTime = date.toLocaleTimeString("en-US", { hour12: false });
  return formattedTime;
}

//Backend to Frontend Display - Get "00:00" from "00:00:00"
export function convertTimeToString(time: string) {
  // Split the input string by the colon ':'
  const [hours, minutes] = time.split(":");
  // Return formatted time as 'HH:MM'
  return `${hours}:${minutes}`;
}

export function convertIntegerToStringTime(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

//Return Time Integer for Calculation - Get "22" from "22:00:00"
export function getHourFromTime(time: string, isEndTime: boolean) {
  let timeBreakdown = time.split(":").map(Number); //[0, 0, 0]
  if (isEndTime) {
    if ((timeBreakdown[0] === 23 && timeBreakdown[1] === 59) || (timeBreakdown[0] === 0 && timeBreakdown[1] === 0)) {
      timeBreakdown = [24, 0, 0];
    }
  }
  return timeBreakdown[0];
}

//Calculate the end time by adding 1 hour to the start time
export function calculateBookingEndTime(startTime: string) {
  const bookingDurationInHour = 1;
  return convertIntegerToStringTime(parseInt(startTime.split(":")[0]) + bookingDurationInHour);
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
