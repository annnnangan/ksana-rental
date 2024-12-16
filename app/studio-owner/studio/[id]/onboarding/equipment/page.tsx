import React from "react";
import EquipmentForm from "./EquipmentForm";
import StepTitle from "../_component/StepTitle";
import { studioService } from "@/services/StudioService";

const EquipmentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);
  const userId = 1;

  const equipmentListResponse = await studioService.getStudioEquipment(
    studioId,
    userId
  );

  if (!equipmentListResponse.success) return;

  const defaultValue = equipmentListResponse.data
    ? equipmentListResponse.data.map((item) => item.equipment)
    : [];

  return (
    <>
      <div>
        <StepTitle>設定場地設備</StepTitle>
        <p className="text-sm md:text-base mb-6">選擇場地內有的設備。</p>
      </div>
      <EquipmentForm defaultValue={defaultValue} />
    </>
  );
};

export default EquipmentPage;
