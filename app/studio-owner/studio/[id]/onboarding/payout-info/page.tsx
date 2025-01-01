import { studioService } from "@/services/StudioService";
import StepTitle from "../_component/StepTitle";
import PayoutForm from "./PayoutForm";

const PayoutDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);
  const userId = 1;

  const defaultValueResult = await studioService.getPayoutDetail(
    studioId,
    userId
  );

  const defaultValue = defaultValueResult.success && defaultValueResult.data;

  return (
    <>
      <div>
        <StepTitle>填寫收帳資料</StepTitle>
        <p className="text-sm md:text-base mb-6">
          我們會利用以下所填寫資料將每星期款項存入你的帳戶，請確保資料正確，否則會無法收取款項。
        </p>
      </div>

      <PayoutForm studioId={studioId} defaultValue={defaultValue} />
    </>
  );
};

export default PayoutDetailPage;
