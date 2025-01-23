import { PayoutMethod, PayoutStatus } from "@/services/model";
import { startOfWeek, subDays } from "date-fns";
import PayoutFilters from "./_components/PayoutFilters";
import PayoutOverviewTable, {
  PayoutQuery,
} from "./_components/PayoutOverviewTable";

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

  const defaultStartDate = subDays(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    14
  );

  const defaultEndDate = subDays(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    8
  );

  return (
    <div className="flex flex-col gap-10">
      <PayoutFilters
        defaultStartDate={defaultStartDate}
        defaultEndDate={defaultEndDate}
      />

      <PayoutOverviewTable
        searchParams={searchParams}
        defaultStartDate={defaultStartDate}
        defaultEndDate={defaultEndDate}
      />
    </div>
  );
};

export default PayoutPage;
