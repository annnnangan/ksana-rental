import ResponsiveTab from "@/components/custom-components/layout/ResponsiveTab";
import BasicInfoForm from "@/components/custom-components/studio-details/BasicInfoForm";
import SectionTitle from "@/components/custom-components/studio-details/SectionTitle";
import { studioService, StudioService } from "@/services/studio/StudioService";

interface SearchQuery {
  tab: string;
}

interface Params {
  id: string;
}

interface Props {
  searchParams: SearchQuery;
  params: Params;
}

const tabListMap = [
  { name: "基本資料", query: "basic-info" },
  { name: "圖片", query: "gallery" },
  { name: "聯絡", query: "contact" },
  { name: "設備", query: "equipment" },
  { name: "大門密碼", query: "door-password" },
];

const StudioInformationPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const { id: studioId } = await props.params;
  const activeTab = searchParams["tab"] || "basic-info";

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
      <SectionTitle>更改場地資料</SectionTitle>
      <ResponsiveTab activeTab={activeTab} tabListMap={tabListMap} />
      <div className="mt-5">{activeTab === "basic-info" && <BasicInfoForm studioId={studioId} isOnboardingStep={false} defaultValues={basicInfoFormDataDefaultValues} />}</div>
    </div>
  );
};

export default StudioInformationPage;
