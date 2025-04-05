"use server";

import { PayoutBreakdownData } from "@/app/admin/payout/studio/[slug]/_component/details-tab-content/DetailsTabContent";
import { StudioPayoutOverviewData } from "@/app/admin/payout/studio/[slug]/page";
import { validatePayoutDates } from "@/lib/utils/date-time/payout-date-validation";
import { payoutService } from "@/services/payout/PayoutService";

// Main function to fetch studio payout overview data
export const getStudioPayoutOverviewData = async (payoutStartDate: string, payoutEndDate: string, slug: string): Promise<ActionDataResponse<StudioPayoutOverviewData>> => {
  // Validate payout dates
  const validateDate = validatePayoutDates(payoutStartDate, payoutEndDate);

  if (!validateDate.success) {
    return validateDate; // Return validation error
  }

  // Fetch data from the service
  const allStudiosPayoutOverviewDataResponse = await payoutService.getStudioPayoutOverview(payoutStartDate, payoutEndDate, slug);

  const payoutProofImagesResponse = await payoutService.getStudioPayoutProof(payoutStartDate, payoutEndDate, slug);

  if (!allStudiosPayoutOverviewDataResponse.success) {
    return {
      success: false,
      error: {
        message: allStudiosPayoutOverviewDataResponse?.error?.message || "系統出現錯誤。",
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

  const combinedData = {
    ...allStudiosPayoutOverviewDataResponse.data[0],
    payout_proof: payoutProofImagesResponse.data?.proof_image_urls || undefined,
  };

  return {
    success: true,
    data: combinedData,
  };
};

export const getStudioPayoutBreakdownData = async (payoutStartDate: string, payoutEndDate: string, slug: string): Promise<ActionDataResponse<PayoutBreakdownData>> => {
  // Validate payout dates
  const validateDate = validatePayoutDates(payoutStartDate, payoutEndDate);

  if (!validateDate.success) {
    return validateDate; // Return validation error
  }

  // Fetch data from the service
  const completedBookingResponse = await payoutService.getStudioCompletedBookingList(payoutStartDate, payoutEndDate, slug);

  const disputeTransactionResponse = await payoutService.getStudioDisputeTransactionList(payoutStartDate, payoutEndDate, slug);

  return {
    success: true,
    data: {
      completed_booking_list: completedBookingResponse.data,
      dispute_transaction_list: disputeTransactionResponse.data,
    },
  };
};
