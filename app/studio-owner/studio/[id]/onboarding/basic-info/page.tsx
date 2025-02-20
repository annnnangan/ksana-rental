import BasicInfoForm from "@/components/custom-components/studio-details/BasicInfoForm";

import { studioService } from "@/services/studio/StudioService";
import StepIntro from "../StepIntro";

const StudioCreatePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const studioId = (await params).id;

  const basicInfoFormDataResponse = await studioService.getBasicInfoFormData(studioId);
  if (!basicInfoFormDataResponse.success) {
    return;
  }

  let basicInfoFormDataDefaultValues = basicInfoFormDataResponse.data;

  return (
    <div>
      <StepIntro title={"設定場地基本資料"} />
      <BasicInfoForm studioId={studioId} isOnboardingStep={true} defaultValues={basicInfoFormDataDefaultValues} />
    </div>
  );
};

export default StudioCreatePage;
