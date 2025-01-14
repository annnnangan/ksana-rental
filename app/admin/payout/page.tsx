import { PayoutMethod, PayoutStatus } from "@/services/model";
import PayoutFilters from "./_components/PayoutFilters";
import PayoutTable, { PayoutQuery } from "./_components/PayoutTable";

export interface StudioPayoutList {
  studio_id: number;
  studio_name: string;
  studio_slug: string;
  payout_status: PayoutStatus;
  payout_amount: number;
  payout_method: PayoutMethod;
}

interface StudioPayoutOverviewData {
  total_payout_amount: number;
  payout_list: StudioPayoutList[];
}

interface Props {
  searchParams: PayoutQuery;
}

const PayoutPage = async (props: Props) => {
  const searchParams = await props.searchParams;

  const studioPayoutOverviewData: StudioPayoutOverviewData = {
    total_payout_amount: 2600,
    payout_list: [
      {
        studio_id: 1,
        studio_name: "Soul Yogi Studio",
        studio_slug: "soul-yogi-studio",
        payout_status: "complete",
        payout_amount: 480,
        payout_method: "fps",
      },
      {
        studio_id: 2,
        studio_name: "Olivia Studio",
        studio_slug: "olivia-studio",
        payout_status: "pending",
        payout_amount: 200,
        payout_method: "bank-transfer",
      },
      {
        studio_id: 3,
        studio_name: "Zen Oasis",
        studio_slug: "zen-oasis",
        payout_status: "pending",
        payout_amount: 500,
        payout_method: "fps",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-10">
      <PayoutFilters />
      <PayoutTable
        searchParams={searchParams}
        payoutList={studioPayoutOverviewData.payout_list}
      />
    </div>
  );
};

export default PayoutPage;
