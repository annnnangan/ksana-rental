"use server";

import { StudioPayoutOverviewData } from "@/app/admin/payout/studio/[slug]/page";
import { validatePayoutDates } from "@/lib/utils/date-time/payout-date-validation";
import { payoutService } from "@/services/PayoutService";

// Main function to fetch studio payout overview data
export const getStudioPayoutOverviewData = async (
  payoutStartDate: string,
  payoutEndDate: string,
  slug: string
): Promise<ActionDataResponse<StudioPayoutOverviewData>> => {
  // Validate payout dates
  const validateDate = validatePayoutDates(payoutStartDate, payoutEndDate);

  if (!validateDate.success) {
    return validateDate; // Return validation error
  }

  // Fetch data from the service
  const allStudiosPayoutOverviewDataResponse =
    await payoutService.getStudioPayoutOverview(
      payoutStartDate,
      payoutEndDate,
      slug
    );

  if (!allStudiosPayoutOverviewDataResponse.success) {
    return {
      success: false,
      error: {
        message:
          allStudiosPayoutOverviewDataResponse?.error?.message ||
          "系統出現錯誤。",
      },
    };
  }

  if (allStudiosPayoutOverviewDataResponse.data.length === 0) {
    return {
      success: false,
      error: {
        message: "No payout data for this studio in this period",
      },
    };
  }

  return {
    success: true,
    data: allStudiosPayoutOverviewDataResponse.data[0],
  };
};
