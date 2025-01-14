import React from "react";
import DateFilter from "./filter/DateFilter";
import StatusFilter from "./filter/StatusFilter";
import StudioFilter from "./filter/StudioFilter";
import PaymentMethodFilter from "./filter/PaymentMethodFilter";

const PayoutFilters = () => {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2">
      <DateFilter />
      <StudioFilter />
      <StatusFilter />
      <PaymentMethodFilter />
    </div>
  );
};

export default PayoutFilters;
