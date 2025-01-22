import React from "react";
import DateFilter from "./filter/DateFilter";
import StatusFilter from "./filter/StatusFilter";
import StudioFilter from "./filter/StudioFilter";
import PaymentMethodFilter from "./filter/PaymentMethodFilter";

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
      <PaymentMethodFilter />
    </div>
  );
};

export default PayoutFilters;
