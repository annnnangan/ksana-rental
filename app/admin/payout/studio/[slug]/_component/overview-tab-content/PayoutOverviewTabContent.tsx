"use client";
import { payoutMethod } from "@/services/model";
import { StudioPayoutOverview } from "../../page";
import PayoutStatusBadge from "@/app/admin/payout/_components/PayoutStatusBadge";
import ImagePreview from "./ImagePreview";
import ProofUploadAndPreview from "./ProofUploadAndPreview";

interface Props {
  payoutOverview: StudioPayoutOverview;
}

const PayoutOverviewTabContent = ({ payoutOverview }: Props) => {
  return (
    <div className="flex flex-wrap">
      <div className="flex flex-col gap-5 mb-5 w-full md:basis-1/3">
        <div>
          <p className="font-bold">Payout Status</p>
          <PayoutStatusBadge payoutStatus={payoutOverview.payout_status} />
        </div>
        <div>
          <p className="font-bold">Payout Amount</p>
          <p>HKD$ {payoutOverview.payout_amount}</p>
        </div>
        <div>
          <p className="font-bold">Payout Method</p>
          <p>
            {
              payoutMethod.find(
                (method) => method.value === payoutOverview.payout_method
              )?.label
            }
          </p>
        </div>
        <div>
          <p className="font-bold">Payout Account</p>
          <p>{payoutOverview.payout_account}</p>
        </div>
        <div>
          <p className="font-bold">Payout Name</p>
          <p>{payoutOverview.payout_name}</p>
        </div>
      </div>

      <div className="w-full md:basis-2/3">
        {payoutOverview.payout_proof ? (
          <ImagePreview
            images={payoutOverview.payout_proof}
            isExistingImage={true}
          />
        ) : (
          <ProofUploadAndPreview />
        )}
      </div>
    </div>
  );
};

export default PayoutOverviewTabContent;
