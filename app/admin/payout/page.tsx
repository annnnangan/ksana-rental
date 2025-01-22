import { PayoutMethod, PayoutStatus } from "@/services/model";
import PayoutFilters from "./_components/PayoutFilters";
import PayoutTable, { PayoutQuery } from "./_components/PayoutTable";
import { startOfWeek, subDays } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { redirect } from "next/navigation";
import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";
import { fetchWithBaseUrl } from "@/lib/utils/fetch-with-base-url";
import { formatDate, getLastMonday } from "@/lib/utils/date-time-utils";

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

      <PayoutTable
        searchParams={searchParams}
        defaultStartDate={defaultStartDate}
        defaultEndDate={defaultEndDate}
      />
    </div>
  );
};

export default PayoutPage;
