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
