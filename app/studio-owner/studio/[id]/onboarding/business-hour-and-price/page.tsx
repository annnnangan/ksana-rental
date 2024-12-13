import React from "react";
import StepTitle from "../_component/StepTitle";
import BusinessHourAndPriceForm from "./BusinessHourAndPriceForm";

const BusinessHourAndPricePage = () => {
  return (
    <>
      <div>
        <StepTitle>設定營業時間及價格</StepTitle>
        <p className="text-sm md:text-base">
          於此設定場地營業時間及每個時段之價格。若需於營業時間中關閉某些時段，你可於申請送出後，於場地管理系統中的日曆進行調整。
        </p>
      </div>

      <BusinessHourAndPriceForm />
    </>
  );
};

export default BusinessHourAndPricePage;
