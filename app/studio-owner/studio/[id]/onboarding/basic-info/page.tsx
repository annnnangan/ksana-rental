import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { studioService } from "@/services/StudioService";
import BasicInfoForm from "./_component/BasicInfoForm";
import { BasicInfo } from "@/services/model";

//Component
const StudioCreatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);

  //Get User ID
  const userId = 1;

  //Global variable for storing image URL from server
  let basicInfoData: BasicInfo = {
    cover_photo: null,
    logo: null,
    name: null,
    slug: null,
    status: "draft",
    district: null,
    address: null,
    description: null,
  };

  try {
    //Get Basic Info from Database
    const basicInfo = await studioService.getStudioBasicInfo(studioId, userId);
    if (basicInfo?.success) {
      basicInfoData = basicInfo.data;
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "系統出現錯誤，請重試。";
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={errorMessage}
        redirectPath={"/studio-owner/dashboard"}
      />
    );
  }

  return <BasicInfoForm studioId={studioId} basicInfoData={basicInfoData} />;
};

export default StudioCreatePage;
