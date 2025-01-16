import { PayoutMethod, PayoutStatus } from "@/services/model";
import PayoutDetailsTab from "./PayoutDetailsTab";
import StudioBasicInfo from "./StudioBasicInfo";

interface StudioInfo {
  studio_id: number;
  studio_name: string;
  studio_logo: string;
  studio_contact: string;
  studio_email: string;
}

export interface StudioPayoutOverview {
  payout_status: PayoutStatus;
  payout_amount: number;
  payout_method: PayoutMethod;
  payout_account: string;
  payout_name: string;
  payout_proof: string[] | null;
}

interface StudioPayoutData {
  studio_info: StudioInfo;
  payout_overview: StudioPayoutOverview;
}

interface StudioPayoutQuery {
  startDate: string;
  endDate: string;
}

interface Props {
  searchParams: Promise<StudioPayoutQuery>;
}

const page = async (props: Props) => {
  const searchParams = await props.searchParams;

  const payoutStartDate = searchParams.startDate;
  const payoutEndDate = searchParams.endDate;

  const studioPayoutData: StudioPayoutData = {
    studio_info: {
      studio_id: 1,
      studio_name: "Soul Yogi Studio",
      studio_logo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-logo.png",
      studio_contact: "+8528765432",
      studio_email: "soul-yogi@gmail.com",
    },
    payout_overview: {
      payout_status: "pending",
      payout_amount: 480,
      payout_method: "fps",
      payout_account: "124592-525242",
      payout_name: "Chan Tai Man",
      payout_proof: [
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/payout-proof/payout-proof-1.PNG",
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/payout-proof/payout-proof-2.PNG",
      ],
    },
  };

  return (
    <div>
      <StudioBasicInfo studioInfo={studioPayoutData.studio_info} />
      <p className="text-lg mb-5">
        <span className="font-bold">Payout Period:</span> {payoutStartDate} to{" "}
        {payoutEndDate}
      </p>
      <PayoutDetailsTab payoutOverview={studioPayoutData.payout_overview} />
    </div>
  );
};

export default page;
