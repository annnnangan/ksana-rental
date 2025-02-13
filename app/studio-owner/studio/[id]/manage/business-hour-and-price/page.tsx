import { businessHourType, studioBusinessHourAndPriceFormData } from "@/lib/validations";
import { DayBusinessHour, daysOfWeek, daysOfWeekType, Price } from "@/services/model";

import DateSpecificHours from "@/components/custom-components/manage-studio/DateSpecificHours";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { studioService } from "@/services/studio/StudioService";
import { DateSpecificHoursSchemaFormData } from "@/lib/validations/zod-schema/manage-studio-schema";

const BusinessHourAndPricePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  //Get Studio ID from URL
  const studioId = (await params).id;
  const user = await sessionUser();

  const dateSpecificHoursListResponse = await studioService.getAllDateSpecificHoursByStudioId("2");

  if (!dateSpecificHoursListResponse.success) {
    return;
  }

  const dateSpecificHoursList: DateSpecificHoursSchemaFormData[] | [] = dateSpecificHoursListResponse.success && dateSpecificHoursListResponse.data!;

  // const businessHoursListResponse = await studioService.getStudioBusinessHours(studioId, user?.id);

  // const priceListResponse = await studioService.getStudioPrice(studioId, user?.id);

  // if (!businessHoursListResponse.success || !priceListResponse.success) {
  //   return;
  // }

  // const defaultValue: studioBusinessHourAndPriceFormData = formatData(businessHoursListResponse.data, priceListResponse.data);

  return (
    <>
      <Tabs defaultValue="dateSpecificHours" className="">
        <TabsList className="gap-3 overflow-x-auto">
          <TabsTrigger value="weeklyHours">恆常營業時間</TabsTrigger>
          <TabsTrigger value="dateSpecificHours">設定特定日期可預約時間</TabsTrigger>
        </TabsList>
        <TabsContent value="weeklyHours">{/* <BusinessHourAndPriceForm defaultValue={defaultValue} studioId={studioId} /> */}</TabsContent>
        <TabsContent value="dateSpecificHours">
          <DateSpecificHours studioId={studioId} dateSpecificHoursList={dateSpecificHoursList} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default BusinessHourAndPricePage;

function formatData(businessHourData: DayBusinessHour[], priceData: Price[]): studioBusinessHourAndPriceFormData {
  const { businessHours } = formateBusinessHoursData(businessHourData);
  const { nonPeakHourPrice, peakHourPrice } = formatePriceData(priceData);

  return {
    businessHours,
    nonPeakHourPrice,
    peakHourPrice,
  };
}

function formateBusinessHoursData(businessHourData: DayBusinessHour[]) {
  const formatTime = (time: string) => time && time.slice(0, 5); // Convert "HH:MM:SS" to "HH:MM"

  const businessHours: Record<daysOfWeekType, businessHourType> = daysOfWeek.reduce((acc, day) => {
    const entries = businessHourData.filter((entry) => entry.day_of_week === day);

    if (entries.some((entry) => entry.is_closed) || entries.length === 0) {
      acc[day] = { enabled: false, timeSlots: [] };
    } else {
      acc[day] = {
        enabled: true,
        timeSlots: entries.map(({ open_time, end_time, price_type }) => ({
          open: formatTime(open_time!),
          close: formatTime(end_time!) === "00:00" ? "24:00" : formatTime(end_time!),
          priceType: price_type,
        })),
      };
    }
    return acc;
  }, {} as Record<daysOfWeekType, businessHourType>);

  return {
    businessHours,
  };
}

function formatePriceData(priceData: Price[]) {
  const nonPeakHourPrice = priceData.find((price) => price.price_type === "non-peak")?.price.toString() ?? "";
  const peakHourPrice = priceData.find((price) => price.price_type === "peak")?.price.toString() ?? "";

  return {
    nonPeakHourPrice,
    peakHourPrice,
  };
}
