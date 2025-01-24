type PayoutCompleteRecordType = {
  payoutStartDate: string;
  payoutEndDate: string;
  slug: string;
  method: string;
  account_name: string;
  account_number: string;
  total_payout_amount: number;
  completed_booking_amount: number;
  dispute_amount: number;
  refund_amount: number;
  remarks?: string;
};

type PayoutProofRecordType = {
  payout_id: number;
  proof_image_url: string;
};
