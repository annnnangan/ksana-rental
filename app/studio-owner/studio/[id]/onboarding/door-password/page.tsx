import { studioService } from "@/services/StudioService";
import StepTitle from "../_component/StepTitle";
import DoorPasswordForm from "./DoorPasswordForm";

const DoorPasswordPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);
  const userId = 1;

  const defaultValueResult = await studioService.getDoorPassword(
    studioId,
    userId
  );

  const defaultValue = defaultValueResult.success && defaultValueResult.data;

  console.log(defaultValue);

  return (
    <>
      <div>
        <StepTitle>設定大門密碼</StepTitle>
        <p className="text-sm md:text-base mb-6">
          Ksana會於預約2小時前於平台上自動發送場地大門密碼給場地租用用戶。請選擇是否同意Ksana發送場地大門密碼給場地租用用戶。
        </p>
      </div>

      <DoorPasswordForm studioId={studioId} defaultValue={defaultValue} />
    </>
  );
};

export default DoorPasswordPage;
