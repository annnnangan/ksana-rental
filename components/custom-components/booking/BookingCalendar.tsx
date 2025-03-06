"use client";
import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Switch } from "@/components/shadcn/switch";
import AvatarWithFallback from "../AvatarWithFallback";
import Timeslot from "./Timeslot";

import { CalendarCheck2, Clock10, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { BookingDateTimeSelectFormData, BookingDateTimeSelectSchema } from "@/lib/validations/zod-schema/booking-schema";
import { PriceType } from "@/services/model";
import useBookingStore from "@/stores/BookingStore";
import SubmitButton from "../buttons/SubmitButton";
import ErrorMessage from "../ErrorMessage";
import { useSessionUser } from "@/hooks/use-session-user";
import { toast } from "react-toastify";
import { calculateBookingEndTime } from "@/lib/utils/date-time/date-time-utils";

const timeslotsResult = [
  {
    time: "09:00",
    is_booked: true,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: "10:00",
    is_booked: false,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: "11:00",
    is_booked: false,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: "12:00",
    is_booked: false,
    price: 100,
    price_type: "non-peak",
  },
  {
    time: "13:00",
    is_booked: false,
    price: 200,
    price_type: "non-peak",
  },
  {
    time: "14:00",
    is_booked: false,
    price: 300,
    price_type: "non-peak",
  },
  {
    time: "22:00",
    is_booked: false,
    price: 100,
    price_type: "peak",
  },
  {
    time: "23:00",
    is_booked: false,
    price: 100,
    price_type: "peak",
  },
];

const availableCredit = 50;

const BookingCalendar = () => {
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
      studioSlug: "soul-yogi-studio",
      studioAddress: "1234455463464",
      studioName: "Soul Yogi Studio",
      studioLogo: "https://images.unsplash.com/photo-1740507619572-ac180ca2630f?q=80&w=1487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

  const onSubmit = (data: BookingDateTimeSelectFormData) => {
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
    router.push("/booking/confirmation");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="flex flex-col space-y-5 md:flex-row md:justify-center md:space-x-12 bg-gray-50 py-5 px-4 rounded-xl shadow">
              <div className="flex flex-col items-center space-y-2">
                {errors?.date && <ErrorMessage>{errors?.date?.message}</ErrorMessage>}
                <Calendar
                  mode="single"
                  selected={dateWatch}
                  onSelect={(date) => setValue("date", date!)}
                  className="rounded-md border"
                  initialFocus
                  disabled={{ before: new Date() }}
                  fromMonth={startMonth}
                  toMonth={endMonth}
                />
              </div>
              <div className="space-y-7">
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
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {timeslotsResult.map((time) => (
                      <Timeslot
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
                </div>
              </div>
            </div>
            <div className="bg-gray-50 py-5 px-4 rounded-xl shadow space-y-5">
              <div className="flex items-center gap-2">
                <AvatarWithFallback avatarUrl={null} type={"studio"} />
                <p>場地名字</p>
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck2 size={20} />
                <p>預約日期：{formatDate(dateWatch)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock10 size={20} />
                <p>
                  預約時間：{startTimeWatch} - {calculateBookingEndTime(startTimeWatch)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <>
          {/* Order Information - Mobile - Sticky bottom banner */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 rounded-t-xl z-10 shadow-lg p-4 flex justify-between items-center h-16 lg:hidden">
            <p className="text-lg font-bold">HK$ {startTimeWatch ? paidAmountWatch : "---"}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDrawerOpen((prev) => !prev)} type="button">
                詳情
              </Button>
              <Button className="w-24">下一步</Button>
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
  useQuery({
    queryKey: ["timeslots", selectedStudioSlug, selectedDate],
    queryFn: async () => {
      const res = await fetch(`/api/studio`);
      const result = await res.json();
      return result.data as { name: string; slug: string }[];
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    enabled: !!selectedStudioSlug && !!selectedDate, // Only fetch when both studioId and date are present
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
