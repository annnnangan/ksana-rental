import DateFilter from "@/components/custom-components/filters-and-sort/payout/DateFilter";
import PayoutMethodFilter from "@/components/custom-components/filters-and-sort/payout/PayoutMethodFilter";
import StatusFilter from "@/components/custom-components/filters-and-sort/payout/StatusFilter";
import StudioFilter from "@/components/custom-components/filters-and-sort/payout/StudioFilter";
import PayoutOverviewTable, { PayoutQuery } from "@/components/custom-components/payout/PayoutOverviewTable";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { startOfWeek, subDays } from "date-fns";

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
  const defaultStartDate = subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 14);
  const defaultEndDate = subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 8);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-x-8 gap-y-2 mt-5">
        <DateFilter defaultStartDate={defaultStartDate} defaultEndDate={defaultEndDate} />
        <StudioFilter />
        <StatusFilter />
        <PayoutMethodFilter />
      </div>

      <PayoutOverviewTable searchParams={searchParams} defaultStartDate={defaultStartDate} defaultEndDate={defaultEndDate} />
    </div>
  );
};

export default PayoutPage;
