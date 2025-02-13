"use client";

import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { generateTimeslots } from "@/lib/utils/date-time/generate-timeslot";
import { DateSpecificHoursSchema, DateSpecificHoursSchemaFormData } from "@/lib/validations/zod-schema/manage-studio-schema";
import ErrorMessage from "../ErrorMessage";
import SubmitButton from "../SubmitButton";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, CirclePlus, Clock7, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { saveDateSpecificHours } from "@/actions/manage-studio";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils/date-time/date-time-utils";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Image from "next/image";

interface Props {
  studioId: string;
  dateSpecificHoursList: DateSpecificHoursSchemaFormData[] | [];
}

const DateSpecificHours = ({ studioId, dateSpecificHoursList }: Props) => {
  const router = useRouter();
  // useState / useTransaction
  const [isOpenModal, setOpenModal] = useState(false);
  const [isOpenDeleteConfirmationModal, setOpenDeleteConfirmationModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<DateSpecificHoursSchemaFormData | null>(null);

  // useForm
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DateSpecificHoursSchemaFormData>({
    resolver: zodResolver(DateSpecificHoursSchema),
    defaultValues: {
      timeslots: [{ from: "00:00", to: "18:00", price_type: "non-peak" }],
    },
  });

  const timeslotsWatch = watch("timeslots");
  const dateWatch = watch("date");

  // variable
  const fromTimeslots = useMemo(() => {
    const timeslots = generateTimeslots("from");
    return timeslots;
  }, []);

  const toTimeslots = useMemo(() => {
    const timeslots = generateTimeslots("to");
    return timeslots;
  }, []);

  // handle function
  const handleCloseModal = () => {
    reset();
    setOpenModal(false);
  };

  const handleAddTimeslot = () => {
    setValue("timeslots", [...(timeslotsWatch || []), { from: "", to: "", price_type: "non-peak" }]);
  };

  const handleRemoveTimeslot = (index: number) => {
    setValue(
      `timeslots`,
      timeslotsWatch.filter((_, i) => i !== index)
    );
  };

  const handleUpdateTimeslot = (index: number, field: "from" | "to" | "price_type", value: string) => {
    setValue(`timeslots.${index}.${field}`, value);
  };

  const handleDeleteDateSpecificHours = (date: Date) => {};

  // submit function
  const onSubmit = (data: DateSpecificHoursSchemaFormData) => {
    startTransition(() => {
      saveDateSpecificHours(data, studioId).then((data) => {
        toast(data.error?.message || "成功新增特定日期之可預約時間。", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });
        reset();
        setOpenModal(false);
        router.refresh();
      });
    });
  };

  return (
    <div className="mt-5">
      <Dialog open={isOpenModal}>
        <Button onClick={() => setOpenModal(true)}>
          <CalendarPlus className="mr-1 h-4 w-4" />
          <span>新增</span>
        </Button>

        <DialogContent hideClose className="p-0 max-h-[90vh] overflow-y-auto">
          <X onClick={handleCloseModal} className="cursor-pointer w-5 h-5 text-gray-500 absolute top-0 right-0 me-5 mt-5" />
          <DialogHeader className="px-5 pt-8">
            <DialogTitle>請選擇一個你想更改時間的日期</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center mb-5">
              <Controller
                name={`date`}
                control={control}
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setValue(`timeslots`, [{ from: "00:00", to: "18:00", price_type: "non-peak" }]);
                    }}
                    initialFocus
                    disabled={{ before: new Date() }}
                    defaultMonth={new Date()}
                    fromMonth={new Date()}
                  />
                )}
              />
            </div>

            {dateWatch && (
              <div className="bg-brand-50 p-5">
                <p className="text-sm">設定可預約時間及其時段價格</p>

                <p onClick={() => handleAddTimeslot()} className="flex items-center justify-end gap-x-1 hover:text-primary transition-colors cursor-pointer mb-3 text-gray-500 text-sm">
                  <CirclePlus className="w-4 h-4" />
                  <span>新增時段</span>
                </p>
                {timeslotsWatch.length === 0 && <p className="text-center text-gray-400">-- 沒有可預約時間 --</p>}
                {timeslotsWatch.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {errors.timeslots?.root && <ErrorMessage>{errors.timeslots?.root?.message}</ErrorMessage>}
                    <ul className="flex flex-col gap-y-5 md:gap-y-2">
                      {timeslotsWatch.map((timeslot, index) => (
                        <li className="flex flex-col" key={index}>
                          <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
                            {/* from */}
                            <Controller
                              name={`timeslots.${index}.from`}
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={(value) => handleUpdateTimeslot(index, "from", value)}>
                                  <SelectTrigger className="w-fit">
                                    <SelectValue placeholder="開始時間" />
                                  </SelectTrigger>
                                  <SelectContent>
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
                            {/* to */}
                            <Controller
                              name={`timeslots.${index}.to`}
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={(value) => handleUpdateTimeslot(index, "to", value)}>
                                  <SelectTrigger className="w-fit">
                                    <SelectValue placeholder="完結時間" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {toTimeslots?.map((time) => (
                                      <SelectItem value={time} key={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            {/* price type */}
                            <Controller
                              name={`timeslots.${index}.price_type`}
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={(value) => handleUpdateTimeslot(index, "price_type", value)}>
                                  <SelectTrigger className="w-fit">
                                    <SelectValue placeholder="完結時間" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="peak">Peak Hour</SelectItem>
                                    <SelectItem value="non-peak">Non-Peak Hour</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            <X className="cursor-pointer w-4 h-4" onClick={() => handleRemoveTimeslot(index)} />
                          </div>

                          {/* Display error */}
                          <div className="flex flex-wrap gap-2">
                            <ErrorMessage>{errors.timeslots?.[index]?.from?.message}</ErrorMessage>
                            <ErrorMessage>{errors.timeslots?.[index]?.to?.message}</ErrorMessage>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Button */}
                <div className="flex items-center gap-3 mt-5">
                  <SubmitButton withIcon={false} isSubmitting={isSubmitting} nonSubmittingText="確認" className="w-1/2" />
                  <Button type="button" variant="outline" className="w-1/2 mt-5" disabled={isSubmitting} onClick={handleCloseModal}>
                    取消
                  </Button>
                </div>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-5">
        {dateSpecificHoursList.length == 0 && (
          <div className="flex flex-col items-center">
            <Image src="/yoga-cartoon/yoga-girl-doing-triangle-pose.png" alt="yoga image" width="250" height="250" />
            <p className="text-gray-500">-- 未有設定 --</p>
          </div>
        )}
        {dateSpecificHoursList.length > 0 && (
          <ul>
            {dateSpecificHoursList.map((item) => (
              <li key={JSON.stringify(item.date)} className="border-b flex flex-wrap justify-between gap-x-10 gap-y-2 hover:bg-gray-50 cursor-pointer p-3 transition-colors">
                <div className="md:flex gap-x-10 gap-y-3">
                  <p className="font-bold text-brand-700">{formatDate(item.date)}</p>
                  {item.timeslots.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {item.timeslots.map((slot, index) => (
                        <li key={index} className="flex gap-x-5">
                          <span className="flex gap-2 items-center">
                            <Clock7 className="w-5 h-5" />
                            {slot.from} - {slot.to}
                          </span>
                          <span>{slot.price_type === "non-peak" ? "Non-Peak Hour" : "Peak Hour"}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">沒有可預約時間</span>
                  )}
                </div>

                {/* Delete button */}
                <X
                  className="cursor-pointer hover:text-primary"
                  onClick={() => {
                    setOpenDeleteConfirmationModal(true);
                    setSelectedDeleteItem(item);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDeleteItem && (
        <DeleteConfirmationModal
          isOpenModal={isOpenDeleteConfirmationModal}
          setOpenModal={setOpenDeleteConfirmationModal}
          handleDeleteItem={() => handleDeleteDateSpecificHours(selectedDeleteItem.date)}
        >
          <div className="flex flex-col items-center">
            <p>你確定要刪除以下時間？</p>
            <p className="text-sm text-gray-700">刪除後，該日期之可預約時間，會根據恆常營業時間的設定。</p>
            <p className="text-lg mt-2 text-primary font-bold">{formatDate(selectedDeleteItem.date)}</p>
            {selectedDeleteItem.timeslots.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {selectedDeleteItem.timeslots.map((slot, index) => (
                  <li key={index} className="flex gap-x-5">
                    <span className="flex gap-2 items-center">
                      <Clock7 className="w-5 h-5" />
                      {slot.from} - {slot.to}
                    </span>
                    <span>{slot.price_type === "non-peak" ? "Non-Peak Hour" : "Peak Hour"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-500">沒有可預約時間</span>
            )}
          </div>
        </DeleteConfirmationModal>
      )}
    </div>
  );
};

export default DateSpecificHours;
