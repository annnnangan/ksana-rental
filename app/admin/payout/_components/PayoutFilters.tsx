import DateFilter from "./filter/DateFilter";
import PayoutMethodFilter from "./filter/PayoutMethodFilter";
import StatusFilter from "./filter/StatusFilter";
import StudioFilter from "./filter/StudioFilter";

interface Props {
  defaultStartDate: Date;
  defaultEndDate: Date;
}

const PayoutFilters = ({ defaultStartDate, defaultEndDate }: Props) => {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2">
      <DateFilter
        defaultStartDate={defaultStartDate}
        defaultEndDate={defaultEndDate}
      />
      <StudioFilter />
      <StatusFilter />
      <PayoutMethodFilter />
    </div>
  );
};

export default PayoutFilters;
