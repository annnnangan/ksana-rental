import { PayoutMethod, PayoutStatus } from "@/services/model";
import PayoutFilters from "./_components/PayoutFilters";
import PayoutTable, { PayoutQuery } from "./_components/PayoutTable";

export interface StudiosPayoutList {
  studio_id: number;
  studio_name: string;
  studio_slug: string;
  payout_status: PayoutStatus;
  payout_amount: number;
  payout_method: PayoutMethod;
}

interface StudiosPayoutOverviewData {
  total_payout_amount: number;
  studios_payout_list: StudiosPayoutList[];
}

interface Props {
  searchParams: PayoutQuery;
}

const PayoutPage = async (props: Props) => {
  const searchParams = await props.searchParams;

  const studiosPayoutOverviewData: StudiosPayoutOverviewData = {
    total_payout_amount: 2600,
    studios_payout_list: [
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
        studio_name: "Zo",
        studio_slug: "zod",
        payout_status: "pending",
        payout_amount: 480,
        payout_method: "bank-transfer",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-10">
      <PayoutFilters />
      <PayoutTable
        searchParams={searchParams}
        payoutList={studiosPayoutOverviewData.studios_payout_list}
      />
    </div>
  );
};

export default PayoutPage;
