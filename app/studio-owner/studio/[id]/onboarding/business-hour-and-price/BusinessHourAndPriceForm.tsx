"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { Loader2, MoveRight } from "lucide-react";
import { daysOfWeekType } from "@/services/model";
import {
  studioBusinessHourAndPriceSchema,
  TimeSlotSchema,
} from "@/lib/validations";

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

//Generate a full set of timeslots
const timeOptions = Array.from(
  { length: 25 },
  (_, i) => `${String(i).padStart(2, "0")}:00`
);

type TimeSlotKeys = keyof z.infer<typeof TimeSlotSchema>;
type studioBusinessHourAndPriceFormData = z.infer<
  typeof studioBusinessHourAndPriceSchema
>;

const BusinessHourAndPriceForm = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<studioBusinessHourAndPriceFormData>({
    resolver: zodResolver(studioBusinessHourAndPriceSchema),
    defaultValues: {
      businessHours: daysOfWeekMap.reduce(
        (acc, day) => ({
          ...acc,
          [day.day]: {
            enabled: true,
            timeSlots: [{ open: "10:00", close: "24:00", priceType: "peak" }],
          },
        }),
        {}
      ),
      peakHourPrice: "",
      nonPeakHourPrice: "",
    },
  });

  //Monitor change in businessHours data (e.g. new timeslot added, time change, priceType change) and trigger re-render using react hook form API
  //Get the latest businessHours data with businessHoursData
  const businessHoursData = watch("businessHours");

  //Trigger when user clicks the button to add a new timeslot row to specific day of week
  //- add one more set of data to the existing one
  const handleAddTimeslot = (dayOfWeek: daysOfWeekType) => {
    //businessHours.Monday.timeslots is the data structure
    setValue(`businessHours.${dayOfWeek}.timeSlots`, [
      ...(businessHoursData[dayOfWeek]?.timeSlots || []),
      { open: "", close: "", priceType: "peak" },
    ]);
  };

  //Trigger when user selects/changes value on open time, close time and price type dropdowns
  //- revise the existing value to a new one by using React hook form's setValue method
  //- since this function will be used in open time, close time and price type, we need 4 arguments to make this function reusable in all these 3 fields for different day of week
  //- since there might be more than one timeslot, we need the index so that we know which one to update the value
  const handleUpdateTimeslot = (
    dayOfWeek: daysOfWeekType,
    index: number,
    field: TimeSlotKeys,
    value: string
  ) => {
    setValue(`businessHours.${dayOfWeek}.timeSlots.${index}.${field}`, value);
  };

  //Trigger when user clicks the "移除全部時段" button to reset the timeSlots of a particular day of week business hour to empty array
  const handleRemoveAllTimeslots = (dayOfWeek: daysOfWeekType) => {
    setValue(`businessHours.${dayOfWeek}.timeSlots`, []);
  };

  const getAvailableTimes = (
    dayOfWeek: daysOfWeekType,
    type: TimeSlotKeys,
    index: number
  ) => {
    const selectedSlots = businessHoursData[dayOfWeek]?.timeSlots;

    if (type === "open") {
      // For open time, exclude 24:00 and all times within existing ranges
      return timeOptions.filter(
        (time) =>
          time !== "24:00" &&
          selectedSlots?.every(
            (slot, i) => i === index || time >= slot.close || time < slot.open
          )
      );
    }

    if (type === "close") {
      const openTime = selectedSlots![index]?.open;
      if (!openTime) return []; // No open time selected yet

      // For close time, allow 24:00 and exclude times before the open time or within existing ranges
      return timeOptions.filter(
        (time) =>
          time > openTime &&
          selectedSlots?.every(
            (slot, i) => i === index || time <= slot.open || time >= slot.close
          )
      );
    }

    return timeOptions;
  };

  const onSubmit = (data: studioBusinessHourAndPriceFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Set up price for peak / non-peak hours  */}
      <div className="border-2 rounded-md p-5 md:p-8 mt-8 md:mt-12">
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
              min="1"
              {...register("peakHourPrice")}
            />
          </div>
          {errors.peakHourPrice && (
            <ErrorMessage>{errors.peakHourPrice.message}</ErrorMessage>
          )}
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
              min="1"
              {...register("nonPeakHourPrice")}
            />
          </div>
          {errors.nonPeakHourPrice && (
            <ErrorMessage>{errors.nonPeakHourPrice.message}</ErrorMessage>
          )}
        </div>
      </div>

      {/* Generate fields for each day in a week dynamically */}
      {daysOfWeekMap.map((day) => (
        <div
          key={day.day}
          className="border-2 rounded-md p-5 md:p-8 mt-8 md:mt-12"
        >
          {/* Default views - a switch with day of week label */}
          <div className="flex">
            <div className="flex items-center gap-x-5">
              <Controller
                name={`businessHours.${day.day}.enabled`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) =>
                      setValue(`businessHours.${day.day}.enabled`, value)
                    }
                  />
                )}
              />
              <Label className="text-lg font-bold">{day.label}</Label>
            </div>

            {/* Display a Closed badge when that day of week is not enabled */}
            {!businessHoursData[day.day]?.enabled && (
              <div className="ms-auto">
                <Badge className="bg-gray-400 pointer-events-none">
                  Closed
                </Badge>
              </div>
            )}
          </div>

          {/* When that day of week is being enabled - display open time, close time, price type selection */}
          {businessHoursData[day.day]?.enabled && (
            <div>
              {/* Get the watch businessHours data */}
              {businessHoursData[day.day]?.timeSlots?.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center gap-2 mt-5"
                >
                  {/* Open Time */}
                  <Controller
                    name={`businessHours.${day.day}.timeSlots.${index}.open`}
                    control={control}
                    render={({ field }) => (
                      //  When user select one of the timeslot, update the businessHours data
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          handleUpdateTimeslot(day.day, index, "open", value)
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="開始時間" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Loop out all the available timeslot */}
                          {getAvailableTimes(day.day, "open", index).map(
                            (time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <span>-</span>

                  {/* Close Time */}
                  <Controller
                    name={`businessHours.${day.day}.timeSlots.${index}.close`}
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            handleUpdateTimeslot(day.day, index, "close", value)
                          }
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="結束時間" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableTimes(day.day, "close", index).map(
                              (time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              )
                            )}
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
                      {
                        errors.businessHours?.[day.day]?.timeSlots?.[index]
                          ?.open?.message
                      }
                    </ErrorMessage>

                    <ErrorMessage>
                      {
                        errors.businessHours?.[day.day]?.timeSlots?.[index]
                          ?.close?.message
                      }
                    </ErrorMessage>

                    <ErrorMessage>
                      {
                        errors.businessHours?.[day.day]?.timeSlots?.[index]
                          ?.priceType?.message
                      }
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

      <Button type="submit" className="mt-5 px-12" disabled={isSubmitting}>
        {isSubmitting ? "資料儲存中..." : "往下一步"}
        {isSubmitting ? <Loader2 className="animate-spin" /> : <MoveRight />}
      </Button>
    </form>
  );
};

export default BusinessHourAndPriceForm;
