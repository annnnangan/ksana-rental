import { isBefore, setHours, setMinutes, setSeconds } from "date-fns";

export function formatDateSpecificHours(data: []) {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  const groupedData: Record<string, any[]> = {};

  data.forEach(({ date, from, to, price_type }) => {
    const formattedDate = new Date(date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD

    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = [];
    }

    groupedData[formattedDate].push({ from, to, price_type });
  });

  // Convert grouped object into an array
  return Object.entries(groupedData).map(([date, timeslots]) => ({
    date,
    timeslots,
  }));
}

//accept Date or string (2025-03-16)
export function isPastDateTime(date: Date | string, time: string) {
  // Split the start time into hours, minutes, and seconds
  const [hours, minutes, seconds] = time.split(":").map(Number);

  // Combine selected date with start time
  const selectedDateTime = setSeconds(setMinutes(setHours(date, hours), minutes), seconds ?? 0);

  // Get the current date-time in UTC+8 (HKT)
  const todayDate = new Date();

  // Validate if selected date and time are in the past
  return isBefore(selectedDateTime, todayDate);
}

//accept Date or string (2025-03-16)
export function isPastDate(date: Date | string) {
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
