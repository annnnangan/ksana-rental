import DateFilter from "@/components/custom-components/filters-and-sort/payout/DateFilter";
import PayoutMethodFilter from "@/components/custom-components/filters-and-sort/payout/PayoutMethodFilter";
import StatusFilter from "@/components/custom-components/filters-and-sort/payout/StatusFilter";
import StudioFilter from "@/components/custom-components/filters-and-sort/payout/StudioFilter";
import PayoutOverviewTable, {
  PayoutQuery,
} from "@/components/custom-components/payout/PayoutOverviewTable";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { startOfWeek, subDays } from "date-fns";
import { payoutService } from "@/services/payout/PayoutService";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";

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
  const payoutStartDate = searchParams.startDate || formatDate(defaultStartDate);
  const payoutEndDate = searchParams.endDate || formatDate(defaultEndDate);

  // const totalPayout = (await payoutService.getWeeklyTotalPayout({ payoutStartDate, payoutEndDate })).data.total_payout_amount;

  return (
    <>
      <SectionTitle textColor="text-primary">Payout</SectionTitle>
      <div className="flex flex-col mt-5">
        <DateFilter defaultStartDate={defaultStartDate} defaultEndDate={defaultEndDate} />

        <div className="mb-10">
          <h2 className="text-xl font-bold mt-2">This Week Total Payout: HKD$ {0} </h2>
        </div>
        <div className="flex gap-4 mb-3">
          <StudioFilter />
          <StatusFilter />
          <PayoutMethodFilter />
        </div>
        <PayoutOverviewTable
          searchParams={searchParams}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
        />
      </div>
    </>
  );
};

export default PayoutPage;
