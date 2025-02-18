import BasicInfoForm from "@/components/custom-components/studio-details/BasicInfoForm";

import StepTitle from "../_component/StepTitle";
import { studioService } from "@/services/studio/StudioService";

const StudioCreatePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const studioId = (await params).id;

  let basicInfoFormDataDefaultValues = {
    logo: "",
    cover_photo: "",
    name: "",
    slug: "",
    description: "",
    address: "",
    district: "",
  };

  const basicInfoFormDataResponse = await studioService.getBasicInfoFormData(studioId);
  if (!basicInfoFormDataResponse.success) {
    return;
  }

  basicInfoFormDataDefaultValues = basicInfoFormDataResponse.data;

  return (
    <div>
      <StepTitle>設定場地基本資料</StepTitle>
      <BasicInfoForm studioId={studioId} isOnboardingStep={true} defaultValues={basicInfoFormDataDefaultValues} />
    </div>
  );
};

export default StudioCreatePage;
