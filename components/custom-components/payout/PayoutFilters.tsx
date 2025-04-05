import DateFilter from "../../../../components/custom-components/filters-and-sort/payout/DateFilter";
import PayoutMethodFilter from "../../../../components/custom-components/filters-and-sort/payout/PayoutMethodFilter";
import StatusFilter from "../../../../components/custom-components/filters-and-sort/payout/StatusFilter";
import StudioFilter from "../../../../components/custom-components/filters-and-sort/payout/StudioFilter";

interface Props {
  defaultStartDate: Date;
  defaultEndDate: Date;
}

const PayoutFilters = ({ defaultStartDate, defaultEndDate }: Props) => {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2">
      <DateFilter defaultStartDate={defaultStartDate} defaultEndDate={defaultEndDate} />
      <StudioFilter />
      <StatusFilter />
      <PayoutMethodFilter />
    </div>
  );
};

export default PayoutFilters;
