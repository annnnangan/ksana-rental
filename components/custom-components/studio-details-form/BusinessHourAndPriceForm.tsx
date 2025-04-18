"use client";

import ErrorMessage from "@/components/custom-components/common/ErrorMessage";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Switch } from "@/components/shadcn/switch";
import SubmitButton from "@/components/custom-components/common/buttons/SubmitButton";
import { toast } from "react-toastify";

import { generateTimeslots } from "@/lib/utils/date-time/generate-timeslot";

import { saveBusinessHoursAndPrice } from "@/actions/studio";
import {
  BusinessHoursAndPriceFormData,
  BusinessHoursAndPriceSchema,
} from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { daysOfWeekType } from "@/services/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useTransition, WheelEvent } from "react";
import { Controller, useForm } from "react-hook-form";

//Create for generating the day of week field in the form
const daysOfWeekMap: {
  day: daysOfWeekType;
  label: string;
}[] = [
  { day: "Monday", label: "星期一" },
  { day: "Tuesday", label: "星期二" },
  { day: "Wednesday", label: "星期三" },
  { day: "Thursday", label: "星期四" },
  { day: "Friday", label: "星期五" },
  { day: "Saturday", label: "星期六" },
  { day: "Sunday", label: "星期日" },
];

interface Props {
  defaultValue: BusinessHoursAndPriceFormData | undefined;
  studioId: string;
  isOnboardingStep: boolean;
}

const emptyDefaultValue = {
  businessHours: {
    Monday: { is_enabled: false, timeslots: [] },
    Tuesday: { is_enabled: false, timeslots: [] },
    Wednesday: { is_enabled: false, timeslots: [] },
    Thursday: { is_enabled: false, timeslots: [] },
    Friday: { is_enabled: false, timeslots: [] },
    Saturday: { is_enabled: false, timeslots: [] },
    Sunday: { is_enabled: false, timeslots: [] },
  },
  peakHourPrice: "",
  nonPeakHourPrice: "",
};

const BusinessHourAndPriceForm = ({ defaultValue, studioId, isOnboardingStep }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BusinessHoursAndPriceFormData>({
    resolver: zodResolver(BusinessHoursAndPriceSchema),
    defaultValues: {
      businessHours: defaultValue?.businessHours || emptyDefaultValue.businessHours,
      peakHourPrice: defaultValue?.peakHourPrice || emptyDefaultValue.peakHourPrice,
      nonPeakHourPrice: defaultValue?.nonPeakHourPrice || emptyDefaultValue.nonPeakHourPrice,
    },
  });

  const businessHoursWatch = watch("businessHours");

  /* -------------------------------- variable -------------------------------- */
  const fromTimeslots = useMemo(() => {
    const timeslots = generateTimeslots("from");
    return timeslots;
  }, []);

  const toTimeslots = useMemo(() => {
    const timeslots = generateTimeslots("to");
    return timeslots;
  }, []);

  /* ---------------------------- Handler Function ---------------------------- */

  // Trigger when user clicks the button to add a new timeslot row to specific day of week
  const handleAddTimeslot = (dayOfWeek: daysOfWeekType) => {
    //businessHours.Monday.timeslots is the data structure
    setValue(`businessHours.${dayOfWeek}.timeslots`, [
      ...(businessHoursWatch[dayOfWeek]?.timeslots || []),
      { from: "", to: "", priceType: "non-peak" },
    ]);
  };

  // Trigger when user selects/changes value on from time, to time and price type dropdowns
  const handleUpdateTimeslot = (
    dayOfWeek: daysOfWeekType,
    index: number,
    field: "from" | "to" | "priceType",
    value: string
  ) => {
    setValue(`businessHours.${dayOfWeek}.timeslots.${index}.${field}`, value);
  };

  // Trigger when user clicks the "移除全部時段" button to reset the timeSlots of a particular day of week business hour to empty array
  const handleRemoveAllTimeslots = (dayOfWeek: daysOfWeekType) => {
    setValue(`businessHours.${dayOfWeek}.is_enabled`, false);
    setValue(`businessHours.${dayOfWeek}.timeslots`, []);
  };

  const onSubmit = async (data: BusinessHoursAndPriceFormData) => {
    startTransition(() => {
      saveBusinessHoursAndPrice(data, studioId, isOnboardingStep).then((data) => {
        toast(data.error?.message || "儲存成功。", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });

        router.refresh();

        if (isOnboardingStep && data.success) {
          router.push(`/studio-owner/studio/${studioId}/onboarding/equipment`);
        }
      });
    });
  };

  /* ------- Others: Remove the default on wheel change for number input ------ */
  const numberInputOnWheelPreventChange = (e: WheelEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement; // Type assertion
    // Prevent the input value change
    target.blur();

    // Prevent the page/container scrolling
    e.stopPropagation();

    setTimeout(() => {
      target.focus();
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Set up price for peak / non-peak hours  */}
      <div className="border-2 rounded-md p-5 md:p-8">
        {/* Peak Hour */}
        <div className="grid w-full md:w-1/2 items-center gap-1">
          <Label htmlFor="peakHourPrice" className="text-base font-bold">
            Peak Hour / 繁忙時段
          </Label>

          <div className="flex items-center">
            <p className="me-2">$</p>
            <Input
              type="number"
              id="peakHourPrice"
              placeholder="請填寫繁忙時段價格。"
              className="text-sm"
              {...register("peakHourPrice")}
              onWheel={numberInputOnWheelPreventChange}
            />
          </div>
          {errors.peakHourPrice && <ErrorMessage>{errors.peakHourPrice.message}</ErrorMessage>}
        </div>
        {/* Non-Peak Hour */}
        <div className="grid w-full md:w-1/2 items-center gap-1 mt-8">
          <Label htmlFor="nonPeakHourPrice" className="text-base font-bold">
            Non-Peak Hour / 非繁忙時段
          </Label>

          <div className="flex items-center">
            <p className="me-2">$</p>
            <Input
              type="number"
              id="nonPeakHourPrice"
              placeholder="請填寫非繁忙時段價格。"
              className="text-sm"
              {...register("nonPeakHourPrice")}
              onWheel={numberInputOnWheelPreventChange}
            />
          </div>
          {errors.nonPeakHourPrice && (
            <ErrorMessage>{errors.nonPeakHourPrice.message}</ErrorMessage>
          )}
        </div>
      </div>

      {/* Generate fields for each day in a week dynamically */}
      {daysOfWeekMap.map((day) => (
        <div key={day.day} className="border-2 rounded-md p-5 md:p-8 mt-8 md:mt-12">
          {/* Default views - a switch with day of week label */}
          <div className="flex">
            <div className="flex items-center gap-x-5">
              <Controller
                name={`businessHours.${day.day}.is_enabled`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value} // When `field.value` is `false`, switch is ON (open)
                    onCheckedChange={(value) => {
                      setValue(`businessHours.${day.day}.is_enabled`, value);
                      setValue(`businessHours.${day.day}.timeslots`, []);
                    }}
                  />
                )}
              />
              <Label className="text-lg font-bold">{day.label}</Label>
            </div>

            {/* Display a Closed badge when that day of week is not enabled */}
            {!businessHoursWatch?.[day.day]?.is_enabled && (
              <div className="ms-auto">
                <Badge className="bg-gray-400 pointer-events-none">Closed</Badge>
              </div>
            )}
          </div>

          {/* When that day of week is being enabled - display open time, close time, price type selection */}
          {businessHoursWatch?.[day.day]?.is_enabled && (
            <div>
              {errors.businessHours?.[day.day]?.timeslots?.root && (
                <ErrorMessage>
                  {errors.businessHours?.[day.day]?.timeslots?.root?.message}
                </ErrorMessage>
              )}
              {errors.businessHours?.[day.day]?.timeslots && (
                <ErrorMessage>{errors.businessHours?.[day.day]?.timeslots?.message}</ErrorMessage>
              )}
              {businessHoursWatch?.[day.day]?.timeslots?.map((slot, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2 mt-5">
                  {/* From Time */}
                  <Controller
                    name={`businessHours.${day.day}.timeslots.${index}.from`}
                    control={control}
                    render={({ field }) => (
                      //  When user select one of the timeslot, update the businessHours data
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          handleUpdateTimeslot(day.day, index, "from", value)
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="開始時間" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Loop out all the available timeslot */}
                          {fromTimeslots?.map((time) => (
                            <SelectItem value={time} key={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <span>-</span>

                  {/* Close Time */}
                  <Controller
                    name={`businessHours.${day.day}.timeslots.${index}.to`}
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            handleUpdateTimeslot(day.day, index, "to", value)
                          }
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="結束時間" />
                          </SelectTrigger>
                          <SelectContent>
                            {toTimeslots?.map((time) => (
                              <SelectItem value={time} key={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  />

                  {/* Price Type */}
                  <Select
                    value={slot.priceType}
                    onValueChange={(value) =>
                      handleUpdateTimeslot(day.day, index, "priceType", value)
                    }
                  >
                    <SelectTrigger className="w-fit">
                      <SelectValue placeholder="價格類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="peak">Peak Hour</SelectItem>
                      <SelectItem value="non-peak">Non-Peak Hour</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Display error */}
                  <div>
                    <ErrorMessage>
                      {errors.businessHours?.[day.day]?.timeslots?.[index]?.from?.message}
                    </ErrorMessage>
                    <ErrorMessage>
                      {errors.businessHours?.[day.day]?.timeslots?.[index]?.to?.message}
                    </ErrorMessage>
                    <ErrorMessage>
                      {errors.businessHours?.[day.day]?.timeslots?.[index]?.priceType?.message}
                    </ErrorMessage>
                  </div>
                </div>
              ))}

              {/* Add Timeslot */}
              <Button
                variant="default"
                type="button"
                className="mt-4"
                onClick={() => handleAddTimeslot(day.day)}
              >
                新增時段
              </Button>

              {/* Remove All Slots */}
              <Button
                variant="destructive"
                onClick={() => handleRemoveAllTimeslots(day.day)}
                type="button"
                className="mt-2 ms-4"
              >
                移除全部時段
              </Button>
            </div>
          )}
        </div>
      ))}

      <SubmitButton
        isSubmitting={isSubmitting || isPending}
        nonSubmittingText={isOnboardingStep ? "往下一步" : "儲存"}
        withIcon={isOnboardingStep ? true : false}
      />
    </form>
  );
};

export default BusinessHourAndPriceForm;
