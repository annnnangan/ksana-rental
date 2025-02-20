import { studioService } from "@/services/studio/StudioService";
import StepIntro from "../StepIntro";
import ConfirmationForm from "./ConfirmationForm";
import ErrorMessage from "@/components/custom-components/ErrorMessage";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";

const ContactPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const studioId = (await params).id;

  const isCompletedAllStepsResponse = await studioService.checkIfCompletedAllOnboardingSteps(studioId);

  let errorMessage;

  if (!isCompletedAllStepsResponse.success) {
    errorMessage = isCompletedAllStepsResponse?.error?.message;
    if (errorMessage === "請勿重複送出申請。") {
      return <ToastMessageWithRedirect type={"error"} message={"請勿重複送出申請。"} redirectPath={"/studio-owner/studios"} />;
    }
  }

  return (
    <>
      <StepIntro title={"確認申請"} description="請閱讀和同意條款與細則，並送出你的申請，Ksana會於3-7個工作天內審查你的申請。"></StepIntro>
      <ConfirmationForm studioId={studioId} isFilledAllSteps={isCompletedAllStepsResponse.success} />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
};

export default ContactPage;
