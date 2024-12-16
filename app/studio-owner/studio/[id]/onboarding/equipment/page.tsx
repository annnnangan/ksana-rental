import React from "react";
import EquipmentForm from "./EquipmentForm";
import StepTitle from "../_component/StepTitle";

const EquipmentPage = () => {
  return (
    <>
      <div>
        <StepTitle>設定場地設備</StepTitle>
        <p className="text-sm md:text-base mb-6">選擇場地內有的設備。</p>
      </div>
      <EquipmentForm />
    </>
  );
};

export default EquipmentPage;
