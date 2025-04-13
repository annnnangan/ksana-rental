import SocialForm from "@/components/custom-components/studio-details-form/SocialForm";
import StepIntro from "../StepIntro";
import { studioService } from "@/services/studio/StudioService";

const SocialPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const studioId = (await params).id;

  const formDataResponse = await studioService.getSocial({ studioId: studioId });

  if (!formDataResponse.success) {
    return;
  }

  let formDataDefaultValues = formDataResponse.data;

  return (
    <>
      <StepIntro
        title="設定場地社交媒體"
        description="請填寫場地社交媒體，讓用戶可以了解更多場地。"
      />
      <SocialForm
        studioId={studioId}
        defaultValues={formDataDefaultValues}
        isOnboardingStep={true}
      />
    </>
  );
};

export default SocialPage;
