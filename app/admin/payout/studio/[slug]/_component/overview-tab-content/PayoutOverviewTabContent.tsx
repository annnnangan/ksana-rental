"use client";
import PayoutStatusBadge from "@/app/admin/payout/_components/PayoutStatusBadge";
import { payoutMethod } from "@/services/model";
import { StudioPayoutOverviewData } from "../../page";
import ImagePreview from "./ImagePreview";
import ProofUploadAndPreview from "./ProofUploadAndPreview";

interface Props {
  payoutOverview: StudioPayoutOverviewData;
}

const PayoutOverviewTabContent = ({
  payoutOverview: {
    payout_status,
    total_payout_amount,
    payout_method,
    payout_account_name,
    payout_account_number,
    payout_proof,
  },
}: Props) => {
  return (
    <div className="flex flex-wrap">
      <div className="flex flex-col gap-5 mb-5 w-full md:basis-1/3">
        <div>
          <p className="font-bold">Payout Status</p>
          <PayoutStatusBadge payoutStatus={payout_status} />
        </div>
        <div>
          <p className="font-bold">Payout Amount</p>
          <p>HKD$ {total_payout_amount}</p>
        </div>
        <div>
          <p className="font-bold">Payout Method</p>
          <p>
            {
              payoutMethod.find((method) => method.value === payout_method)
                ?.label
            }
          </p>
        </div>
        <div>
          <p className="font-bold">Payout Account</p>
          <p>{payout_account_number}</p>
        </div>
        <div>
          <p className="font-bold">Payout Name</p>
          <p>{payout_account_name}</p>
        </div>
      </div>

      <div className="w-full md:basis-2/3">
        {payout_proof ? (
          <ImagePreview images={payout_proof} isExistingImage={true} />
        ) : (
          <ProofUploadAndPreview />
        )}
      </div>
    </div>
  );
};

export default PayoutOverviewTabContent;
