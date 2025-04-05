import ResponsiveTab from "@/components/custom-components/layout/ResponsiveTab";
import LoadingSpinner from "@/components/custom-components/loading/LoadingSpinner";
import BasicInfoForm from "@/components/custom-components/studio-details/BasicInfoForm";
import DoorPasswordForm from "@/components/custom-components/studio-details/DoorPasswordForm";
import EquipmentForm from "@/components/custom-components/studio-details/EquipmentForm";
import GalleryForm from "@/components/custom-components/studio-details/GalleryForm";
import PayoutForm from "@/components/custom-components/studio-details/PayoutForm";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import SocialForm from "@/components/custom-components/studio-details/SocialForm";
import { studioService, StudioService } from "@/services/studio/StudioService";
import { Suspense } from "react";

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
  { name: "設備", query: "equipment" },
  { name: "圖片", query: "gallery" },
  { name: "大門密碼", query: "door-password" },
  { name: "社交媒體", query: "social" },
  { name: "收款資料", query: "payout-info" },
];

const StudioInformationPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const { id: studioId } = await props.params;
  const activeTab = searchParams["tab"] || "basic-info";

  // Fetch only the data for the active tab
  const fetchData = async () => {
    switch (activeTab) {
      case "basic-info":
        return studioService.getBasicInfoFormData(studioId);
      case "equipment":
        return studioService.getEquipment({ studioId: studioId });
      case "gallery":
        return studioService.getGallery({ studioId: studioId });
      case "door-password":
        return studioService.getDoorPassword(studioId);
      case "social":
        return studioService.getSocial({ studioId: studioId });
      case "payout-info":
        return studioService.getPayoutInfo(studioId);
      default:
        return { success: false };
    }
  };

  const dataResponse = await fetchData();
  const defaultValues = dataResponse.success ? dataResponse.data ?? [] : null;

  return (
    <div>
      <SectionTitle>更改場地資料</SectionTitle>
      <ResponsiveTab activeTab={activeTab} tabListMap={tabListMap} />

      {dataResponse.success ? (
        <div className="mt-5">
          <Suspense fallback={<LoadingSpinner />}>
            {activeTab === "basic-info" && <BasicInfoForm studioId={studioId} isOnboardingStep={false} defaultValues={defaultValues} />}
            {activeTab === "gallery" && <GalleryForm studioId={studioId} isOnboardingStep={false} defaultValues={defaultValues} />}
            {activeTab === "equipment" && <EquipmentForm studioId={studioId} isOnboardingStep={false} defaultValues={defaultValues} />}
            {activeTab === "door-password" && <DoorPasswordForm studioId={studioId} isOnboardingStep={false} defaultValues={defaultValues} />}
            {activeTab === "social" && <SocialForm studioId={studioId} isOnboardingStep={false} defaultValues={defaultValues} />}
            {activeTab === "payout-info" && <PayoutForm studioId={studioId} isOnboardingStep={false} defaultValues={defaultValues} />}
          </Suspense>
        </div>
      ) : (
        <p className="text-red-500 mt-5">資料加載失敗，請重試。</p>
      )}
    </div>
  );
};

export default StudioInformationPage;
