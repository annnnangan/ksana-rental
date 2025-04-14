import { DayBusinessHour, daysOfWeek, daysOfWeekType, Price } from "@/services/model";

import BusinessHourAndPrice from "@/components/custom-components/studio-details-form/BusinessHourAndPriceForm";
import DateSpecificHour from "@/components/custom-components/studio-details-form/DateSpecificHour";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { studioService } from "@/services/studio/StudioService";
import { BusinessHoursAndPriceFormData } from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { convertTimeToString } from "@/lib/utils/date-time/format-time-utils";

const BusinessHourAndPricePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  //Get Studio ID from URL
  const studioId = (await params).id;
  const user = await sessionUser();

  if (!user) {
    return <ToastMessageWithRedirect type={"error"} message={"請先登入。"} redirectPath={"/"} />;
  }

  const [dateSpecificHourListResponse, businessHoursListResponse, priceListResponse] =
    await Promise.all([
      studioService.getAllDateSpecificHourByStudioId(studioId),
      studioService.getBusinessHoursByStudioId(studioId),
      studioService.getPrice({ studioId: studioId }),
    ]);

  if (
    !dateSpecificHourListResponse.success ||
    !businessHoursListResponse.success ||
    !priceListResponse.success
  ) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"系統發生錯誤。"}
        redirectPath={"/studio-owner/dashboard"}
      />
    );
  }

  const dateSpecificHourList = formatDateSpecificHours(dateSpecificHourListResponse.data!);
  const businessHoursAndPriceValue: BusinessHoursAndPriceFormData = {
    businessHours: businessHoursListResponse.data,
    nonPeakHourPrice: priceListResponse.data["non-peak"].toString(),
    peakHourPrice: priceListResponse.data["peak"].toString(),
  };

  return (
    <>
      <SectionTitle>設定可預約時間及價錢</SectionTitle>
      <Tabs defaultValue="weeklyHours" className="">
        <TabsList className="gap-3 overflow-x-auto">
          <TabsTrigger value="weeklyHours">恆常營業時間</TabsTrigger>
          <TabsTrigger value="dateSpecificHour">特定日期可預約時間</TabsTrigger>
        </TabsList>
        <TabsContent value="weeklyHours">
          <BusinessHourAndPrice
            studioId={studioId}
            isOnboardingStep={false}
            defaultValue={businessHoursAndPriceValue}
          />
        </TabsContent>
        <TabsContent value="dateSpecificHour">
          <DateSpecificHour studioId={studioId} dateSpecificHourList={dateSpecificHourList} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default BusinessHourAndPricePage;

// format the database data to frontend data
function formatDateSpecificHours(
  data: {
    date: Date;
    is_closed: boolean;
    from: string;
    to: string;
    price_type: "non-peak" | "peak";
  }[]
) {
  const groupedData: Record<
    string,
    { from: string; to: string; priceType: "non-peak" | "peak" }[]
  > = {};

  data.forEach(({ date, is_closed, from, to, price_type }) => {
    const formattedDate = formatDate(new Date(date));

    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = [];
    }

    if (!is_closed) {
      groupedData[formattedDate].push({
        from: convertTimeToString(from),
        to: convertTimeToString(to),
        priceType: price_type,
      });
    }
  });

  // Convert grouped object into the desired format
  return Object.entries(groupedData).map(([date, timeslots]) => ({
    dateSpecificHour: {
      date,
      timeslots,
    },
  }));
}
