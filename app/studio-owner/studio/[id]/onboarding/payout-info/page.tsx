import PayoutForm from "@/components/custom-components/studio-details-form/PayoutForm";
import StepIntro from "../StepIntro";
import { studioService } from "@/services/studio/StudioService";

const PayoutDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const studioId = (await params).id;

  const formDataResponse = await studioService.getPayoutInfo(studioId);

  if (!formDataResponse.success) {
    return;
  }

  const formDataDefaultValues = formDataResponse.data;

  return (
    <>
      <StepIntro
        title="填寫收帳資料"
        description="我們會利用以下所填寫資料將每星期款項存入你的帳戶，請確保資料正確，否則會無法收取款項。"
      />
      <PayoutForm
        studioId={studioId}
        defaultValues={formDataDefaultValues}
        isOnboardingStep={true}
      />
    </>
  );
};

export default PayoutDetailPage;
