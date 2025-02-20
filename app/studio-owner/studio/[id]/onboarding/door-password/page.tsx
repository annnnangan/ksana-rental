import DoorPasswordForm from "@/components/custom-components/studio-details/DoorPasswordForm";
import StepIntro from "../StepIntro";
import { studioService } from "@/services/studio/StudioService";

const DoorPasswordPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  //Get Studio ID from URL
  const studioId = (await params).id;

  const formDataResponse = await studioService.getDoorPassword(studioId);

  if (!formDataResponse.success) {
    return;
  }

  let formDataDefaultValues = formDataResponse.data;

  return (
    <>
      <StepIntro title={"設定大門密碼"} description="Ksana會於預約2小時前於平台上自動發送場地大門密碼給場地租用用戶。" />
      <DoorPasswordForm studioId={studioId} defaultValues={formDataDefaultValues} isOnboardingStep={true} />
    </>
  );
};

export default DoorPasswordPage;
