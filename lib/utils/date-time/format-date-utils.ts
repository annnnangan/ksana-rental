import { formatInTimeZone } from "date-fns-tz";

//Format date for frontend
export function formatDate(date: Date) {
  const timeZone = "Asia/Hong_Kong";
  // Convert the input date to the HKT timezone
  const dateInHKT = formatInTimeZone(date, timeZone, "yyyy-MM-dd");
  // Format the date in HKT
  return dateInHKT;
}
