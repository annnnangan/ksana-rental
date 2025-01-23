import { differenceInDays, getDay, isValid, parseISO } from "date-fns";

export const validatePayoutDates = (
  payoutStartDate: string,
  payoutEndDate: string
): ActionDataResponse<null> => {
  // Check if all date parameters are present
  if (!payoutStartDate || !payoutEndDate) {
    return {
      success: false,
      error: { message: "Missing payout start or end date." },
    };
  }

  // Check if the dates are in a valid format
  const isValidDate = (dateString: string): boolean => {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  };

  if (!isValidDate(payoutStartDate) || !isValidDate(payoutEndDate)) {
    return {
      success: false,
      error: { message: "Invalid date format." },
    };
  }

  // Validate date range: Start on Monday, end on Sunday, and difference is 6 days
  if (
    getDay(new Date(payoutStartDate)) !== 1 || // Monday
    getDay(new Date(payoutEndDate)) !== 0 || // Sunday
    differenceInDays(new Date(payoutEndDate), new Date(payoutStartDate)) !== 6
  ) {
    return {
      success: false,
      error: { message: "Invalid payout date range." },
    };
  }

  return { success: true, data: null }; // Validation passed
};
