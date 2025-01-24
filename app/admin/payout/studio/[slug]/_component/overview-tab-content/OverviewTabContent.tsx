"use client";
import PayoutStatusBadge from "@/app/admin/payout/_components/PayoutStatusBadge";
import ImagesGridPreview from "@/components/custom-components/ImagesGridPreview";
import { payoutMethod } from "@/services/model";
import { StudioPayoutOverviewData } from "../../page";
import ProofUploadAndPreview from "./ProofUploadAndPreview";

interface Props {
  payoutOverview: StudioPayoutOverviewData;
}

const OverviewTabContent = ({ payoutOverview }: Props) => {
  return (
    <div className="flex flex-wrap">
      <div className="flex flex-col gap-5 mb-5 w-full md:basis-1/3">
        <div>
          <p className="font-bold">Payout Status</p>
          <PayoutStatusBadge payoutStatus={payoutOverview.payout_status} />
        </div>
        <div>
          <p className="font-bold">Payout Amount</p>
          <p>HKD$ {payoutOverview.total_payout_amount}</p>
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
          <p>{payoutOverview.payout_account_number}</p>
        </div>
        <div>
          <p className="font-bold">Payout Name</p>
          <p>{payoutOverview.payout_account_name}</p>
        </div>
      </div>

      <div className="w-full md:basis-2/3">
        {payoutOverview.payout_proof ? (
          <ImagesGridPreview
            images={payoutOverview.payout_proof}
            imageAlt={"payout proof"}
            allowDeleteImage={false}
            gridCol={3}
            gridColSpan={""}
            imageRatio="aspect-[3/4]"
          />
        ) : (
          <ProofUploadAndPreview payoutOverview={payoutOverview} />
        )}
      </div>
    </div>
  );
};

export default OverviewTabContent;
