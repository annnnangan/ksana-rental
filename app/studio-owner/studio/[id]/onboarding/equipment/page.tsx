import { studioService } from "@/services/studio/StudioService";
import StepIntro from "../StepIntro";
import EquipmentForm from "@/components/custom-components/studio-details/EquipmentForm";

const EquipmentPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const studioId = (await params).id;

  const formDataResponse = await studioService.getEquipment(studioId);

  if (!formDataResponse.success) {
    return;
  }

  let formDataDefaultValues = formDataResponse.data;

  return (
    <>
      <StepIntro title={"設定場地設備"} description="選擇場地內有的設備。" />
      <EquipmentForm defaultValues={formDataDefaultValues!} studioId={studioId} isOnboardingStep={true} />
    </>
  );
};

export default EquipmentPage;
