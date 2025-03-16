"use client";
import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Switch } from "@/components/shadcn/switch";
import AvatarWithFallback from "../AvatarWithFallback";
import SubmitButton from "../buttons/SubmitButton";
import ErrorMessage from "../ErrorMessage";
import Timeslot from "./Timeslot";

import { CalendarCheck2, CalendarX2, Clock10, MapPinHouse, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { calculateBookingEndTime } from "@/lib/utils/date-time/format-time-utils";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { BookingDateTimeSelectFormData, BookingDateTimeSelectSchema } from "@/lib/validations/zod-schema/booking-schema";
import { PriceType } from "@/services/model";
import useBookingStore from "@/stores/BookingStore";
import SectionFallback from "../SectionFallback";

const BookingCalendar = ({
  bookingStudioBasicInfo,
  availableCredit,
}: {
  bookingStudioBasicInfo: {
    name: string;
    slug: string;
    logo: string;
    cover_photo: string;
    district: string;
    address: string;
    min_price: number;
    number_of_review: number;
    number_of_completed_booking: number;
    rating: number;
  };
  availableCredit: number;
}) => {
  const router = useRouter();

  const [startMonth, setStartMonth] = useState<Date>();
  const [endMonth, setEndMonth] = useState<Date>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { setBookingInfo } = useBookingStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(BookingDateTimeSelectSchema),
    defaultValues: {
      studioSlug: bookingStudioBasicInfo.slug,
      studioAddress: bookingStudioBasicInfo.address,
      studioName: bookingStudioBasicInfo.name,
      studioLogo: bookingStudioBasicInfo.logo,
      date: new Date(),
      startTime: "",
      isUsedCredit: false,
      price: 0,
      usedCredit: 0,
      paidAmount: 0,
    },
  });

  const dateWatch = watch("date");
  const startTimeWatch = watch("startTime");
  const priceWatch = watch("price");
  const isUsedCreditWatch = watch("isUsedCredit");
  const usedCreditWatch = watch("usedCredit");
  const paidAmountWatch = watch("paidAmount");

  const getPaidAmount = () => {
    if (startTimeWatch) {
      if (isUsedCreditWatch) {
        if (availableCredit > priceWatch) {
          setValue("usedCredit", priceWatch);
          setValue("paidAmount", 0);
        } else {
          setValue("usedCredit", availableCredit);
          setValue("paidAmount", priceWatch - availableCredit);
        }
      } else {
        setValue("usedCredit", 0);
        setValue("paidAmount", priceWatch);
      }
    }
  };

  useEffect(() => {
    getPaidAmount();
  }, [startTimeWatch, isUsedCreditWatch, availableCredit]);

  useEffect(() => {
    // Get today's date
    const today = new Date();
    // Calculate the start and end months
    setStartMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setEndMonth(new Date(today.getFullYear(), today.getMonth() + 3, 0));
  }, []);

  const { data: timeslotsResult, isLoading: isLoadingTimeslots, isError } = useBookingTimeslots(bookingStudioBasicInfo.slug, formatDate(dateWatch ?? new Date()));

  const onSubmit = async (data: BookingDateTimeSelectFormData) => {
    setBookingInfo({
      studioName: data.studioName,
      studioSlug: data.studioSlug,
      studioAddress: data.studioAddress,
      studioLogo: data.studioLogo,
      date: data.date,
      startTime: data.startTime,
      price: data.price,
      isUsedCredit: data.isUsedCredit,
      paidAmount: data.paidAmount,
      usedCredit: data.usedCredit,
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/booking/confirmation"); // Wait for navigation
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="flex flex-col space-y-5 md:grid md:grid-cols-3 md:space-x-10 bg-gray-50 py-5 px-10 rounded-xl shadow">
              <div className="flex flex-col items-center space-y-2">
                {errors?.date && <ErrorMessage>{errors?.date?.message}</ErrorMessage>}
                <Calendar
                  mode="single"
                  selected={dateWatch}
                  onSelect={(date) => setValue("date", date!)}
                  required
                  className="rounded-md border"
                  initialFocus
                  disabled={{ before: new Date() }}
                  fromMonth={startMonth}
                  toMonth={endMonth}
                />
              </div>
              <div className="space-y-7 col-span-2">
                <div className="flex md:flex-row items-start flex-wrap">
                  {priceType.map((type) => (
                    <div key={type.label} className="flex justify-center items-center me-4">
                      <div className={classNames(type.bgColor, "rounded-full", "w-3", "h-3", "me-2")}></div>
                      <p className={classNames(type.textColor)}>{type.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {errors?.startTime && <ErrorMessage>{errors?.startTime?.message}</ErrorMessage>}
                  <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {isLoadingTimeslots && Array.from({ length: 15 }, (_, i) => <Timeslot isLoading={true} key={i} />)}

                    {!isLoadingTimeslots &&
                      //@ts-ignore
                      timeslotsResult?.length > 0 &&
                      timeslotsResult?.map((time) => (
                        <Timeslot
                          isLoading={false}
                          key={time.time}
                          isBooked={time.is_booked}
                          priceType={time.price_type as PriceType}
                          startTime={time.time}
                          isSelected={startTimeWatch === time.time.toString()}
                          onSelect={() => {
                            setValue("startTime", time.time);
                            setValue("price", time.price);
                          }}
                        />
                      ))}
                  </div>
                  {!isLoadingTimeslots && timeslotsResult?.length === 0 && <SectionFallback icon={CalendarX2} fallbackText={"暫無可預約時間"} />}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 py-5 px-4 rounded-xl shadow space-y-5">
              <div className="flex items-center gap-2">
                <AvatarWithFallback avatarUrl={bookingStudioBasicInfo.logo} type={"studio"} />
                <p className="font-bold">{bookingStudioBasicInfo.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPinHouse size={20} />
                <p>場地地址：{bookingStudioBasicInfo.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck2 size={20} />
                <p>預約日期：{formatDate(dateWatch)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock10 size={20} />
                <p>預約時間：{startTimeWatch ? `${startTimeWatch} - ${calculateBookingEndTime(startTimeWatch)}` : "---"}</p>
              </div>
            </div>
          </div>
        </div>

        <>
          {/* Order Information - Mobile - Sticky bottom banner */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 rounded-t-xl z-10 shadow-lg p-4 flex justify-between items-center h-16 lg:hidden">
            <p className="text-lg font-bold">HK$ {startTimeWatch ? paidAmountWatch : "---"}</p>
            <div className="flex justify-center items-center gap-2">
              <Button variant="outline" onClick={() => setIsDrawerOpen((prev) => !prev)} type="button">
                詳情
              </Button>
              <SubmitButton isSubmitting={isSubmitting} submittingText={"處理中..."} nonSubmittingText={"下一步"} withIcon={false} className="w-full mb-5" />
            </div>
          </div>

          {/* Order Information - Mobile - Drawer inside sticky bottom banner */}
          {isDrawerOpen && (
            <div className="fixed bottom-16 border-2 rounded-md left-0 w-full bg-white shadow-lg p-5 max-h-[75vh] overflow-y-auto  lg:hidden">
              <div className="flex justify-between items-center mb-4">
                <CardTitle>訂單明細</CardTitle>
                <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <p className="text-xs text-gray-400">你現有{availableCredit}積分</p>
              <div className="flex gap-2 items-center border-b border-gray-300 pb-3">
                <p>使用積分折抵</p>
                <Controller
                  name="isUsedCredit"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          setValue("usedCredit", availableCredit);
                        } else {
                          setValue("usedCredit", 0);
                        }
                      }}
                      //@ts-ignore
                      disabled={!startTimeWatch || availableCredit === 0}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-2 pt-3 text-gray-400 text-sm">
                <div className="flex justify-between">
                  <p>小計</p>
                  <p>HK$ {startTimeWatch ? priceWatch : "--"}</p>
                </div>
                {startTimeWatch && isUsedCreditWatch && (
                  <div className="flex justify-between">
                    <p>積分折抵</p>
                    <p>- HK$ {usedCreditWatch}</p>
                  </div>
                )}
              </div>
              <div className="mt-5">
                <p className="text-2xl font-bold text-end">HK$ {startTimeWatch ? paidAmountWatch : "---"}</p>
              </div>
            </div>
          )}

          {/* Order Information - Desktop - Side panel */}
          <div className="hidden lg:block">
            <Card className="bg-gray-50 border-0">
              <CardHeader>
                <CardTitle>訂單明細</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-400">你現有{availableCredit}積分</p>
                <div className="flex gap-2 items-center border-b border-gray-300 pb-3">
                  <p>使用積分折抵</p>

                  <Controller
                    name="isUsedCredit"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            setValue("usedCredit", availableCredit);
                          } else {
                            setValue("usedCredit", 0);
                          }
                        }}
                        //@ts-ignore
                        disabled={!startTimeWatch || availableCredit == 0}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2 pt-3 text-gray-400 text-sm">
                  <div className="flex justify-between">
                    <p>小計</p>
                    <p>HK$ {startTimeWatch ? priceWatch : "--"}</p>
                  </div>

                  {startTimeWatch && isUsedCreditWatch && (
                    <div className="flex justify-between">
                      <p>積分折抵</p>
                      <p>- HK$ {usedCreditWatch}</p>
                    </div>
                  )}
                </div>
                <div className="mt-5">
                  <p className="text-2xl font-bold text-end">HK$ {startTimeWatch ? paidAmountWatch : "---"}</p>
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton isSubmitting={isSubmitting} submittingText={"處理中..."} nonSubmittingText={"下一步"} withIcon={false} className="w-full" />
              </CardFooter>
            </Card>
          </div>
        </>
      </div>
    </form>
  );
};

export default BookingCalendar;

// React Query to Fetch timeslots
const useBookingTimeslots = (selectedStudioSlug: string, selectedDate: string) => {
  return useQuery({
    queryKey: ["timeslots", selectedStudioSlug, selectedDate],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(`/api/booking/timeslots/${selectedStudioSlug}/${selectedDate}`);
      if (!res.ok) {
        throw new Error("Failed to fetch timeslots");
      }
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data as { time: string; is_booked: boolean; price: number; price_type: string }[];
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    enabled: !!selectedStudioSlug && !!selectedDate, // Fetch only when both are provided
  });
};

const priceType = [
  { label: "非繁忙時間", bgColor: "bg-green-500", textColor: "text-green-500" },
  { label: "繁忙時間", bgColor: "bg-orange-600", textColor: "text-orange-600" },
  {
    label: "已被預約",
    bgColor: "bg-gray-400",
    textColor: "text-gray-400",
  },
];
