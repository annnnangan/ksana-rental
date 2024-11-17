import { format } from "date-fns";

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

//Format date for frontend
export function formatDate(date: Date) {
  return format(new Date(date), "yyyy-MM-dd");
}

//Return the maximum date that user could book
//2 months from the current month
export function maxBookingDate() {
  return new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0);
}
