import React from "react";
import StepTitle from "../_component/StepTitle";
import BusinessHourAndPriceForm from "./BusinessHourAndPriceForm";
import {
  businessHourType,
  studioBusinessHourAndPriceFormData,
} from "@/lib/validations";
import { studioService } from "@/services/StudioService";
import {
  DayBusinessHour,
  daysOfWeek,
  daysOfWeekType,
  Price,
} from "@/services/model";

const BusinessHourAndPricePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);

  //Get User ID
  const userId = 1;

  const businessHoursListResponse = await studioService.getStudioBusinessHours(
    studioId,
    userId
  );
  const priceListResponse = await studioService.getStudioPrice(
    studioId,
    userId
  );

  if (!businessHoursListResponse.success || !priceListResponse.success) {
    return;
  }

  const defaultValue: studioBusinessHourAndPriceFormData = formatData(
    businessHoursListResponse.data,
    priceListResponse.data
  );

  return (
    <>
      <div>
        <StepTitle>設定營業時間及價格</StepTitle>
        <p className="text-sm md:text-base">
          於此設定場地營業時間及每個時段之價格。若需於營業時間中關閉某些時段，你可於申請送出後，於場地管理系統中的日曆進行調整。
        </p>
      </div>

      <BusinessHourAndPriceForm defaultValue={defaultValue} />
    </>
  );
};

export default BusinessHourAndPricePage;

function formatData(
  businessHourData: DayBusinessHour[],
  priceData: Price[]
): studioBusinessHourAndPriceFormData {
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

  const businessHours: Record<daysOfWeekType, businessHourType> =
    daysOfWeek.reduce((acc, day) => {
      const entries = businessHourData.filter(
        (entry) => entry.day_of_week === day
      );

      if (entries.some((entry) => entry.is_closed) || entries.length === 0) {
        acc[day] = { enabled: false, timeSlots: [] };
      } else {
        acc[day] = {
          enabled: true,
          timeSlots: entries.map(({ open_time, end_time, price_type }) => ({
            open: formatTime(open_time!),
            close:
              formatTime(end_time!) === "00:00"
                ? "24:00"
                : formatTime(end_time!),
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
  const nonPeakHourPrice =
    priceData.find((price) => price.price_type === "non-peak")?.price ?? 0;
  const peakHourPrice =
    priceData.find((price) => price.price_type === "peak")?.price ?? 0;

  return {
    nonPeakHourPrice,
    peakHourPrice,
  };
}
