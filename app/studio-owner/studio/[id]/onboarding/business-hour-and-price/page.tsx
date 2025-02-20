import BusinessHourAndPriceForm from "@/components/custom-components/studio-details/BusinessHourAndPriceForm";
import StepIntro from "../StepIntro";
import { formatDateSpecificHours } from "@/lib/utils/date-time/formate-date-time";
import { BusinessHoursAndPriceFormData } from "@/lib/validations/zod-schema/studio/studio-step-schema";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { studioService } from "@/services/studio/StudioService";

const BusinessHourAndPricePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const studioId = (await params).id;

  const [businessHoursListResponse, priceListResponse] = await Promise.all([studioService.getBusinessHoursByStudioId(studioId), studioService.getPriceByStudioId(studioId)]);

  let businessHoursAndPriceValue: BusinessHoursAndPriceFormData | undefined = undefined;

  if (businessHoursListResponse.success && priceListResponse.success) {
    businessHoursAndPriceValue = {
      businessHours: businessHoursListResponse.data,
      nonPeakHourPrice: priceListResponse.data["non-peak"].toString(),
      peakHourPrice: priceListResponse.data["peak"].toString(),
    };
  }

  return (
    <>
      <StepIntro title={"設定營業時間及價格"} description="於此設定場地營業時間及每個時段之價格。若需於營業時間中關閉某些特定日期時段，你可於申請送出後，於場地管理系統中進行調整。"></StepIntro>
      <BusinessHourAndPriceForm defaultValue={businessHoursAndPriceValue} studioId={studioId} isOnboardingStep={true} />
    </>
  );
};

export default BusinessHourAndPricePage;
