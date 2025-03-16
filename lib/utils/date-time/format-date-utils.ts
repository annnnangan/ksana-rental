import { getDay, isBefore, setHours, setMinutes, setSeconds } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const dayOfWeekList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//Format date for frontend
export function formatDate(date: Date | string) {
  const timeZone = "Asia/Hong_Kong";
  // Convert the input date to the HKT timezone
  const dateInHKT = formatInTimeZone(date, timeZone, "yyyy-MM-dd");
  // Format the date in HKT
  return dateInHKT;
}

//Get day of week in English by date
export function getDayOfWeekInEnglishByDate(date: Date) {
  const dateInHKT = formatDate(date);
  return dayOfWeekList[Number(getDay(dateInHKT))];
}
