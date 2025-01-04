"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/utils/date-time-utils";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  updateQueryString: (type: string, value: string) => void;
}

const DatePicker = ({ updateQueryString }: Props) => {
  const searchParams = useSearchParams();

  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") !== null
      ? new Date(searchParams.get("date")!)
      : undefined
  );

  const [startMonth, setStartMonth] = useState<Date>();
  const [endMonth, setEndMonth] = useState<Date>();

  useEffect(() => {
    // Get today's date
    const today = new Date();
    // Calculate the start and end months
    setStartMonth(new Date(today.getFullYear(), today.getMonth(), 1)); // First day of current month
    setEndMonth(new Date(today.getFullYear(), today.getMonth() + 2, 0)); // Last day of two months later
  }, []);

  const handleChange = (day: Date) => {
    setDate(day);
    updateQueryString("date", formatDate(day));
  };

  return (
    <div className="flex flex-col">
      <Label htmlFor="date" className="text-[11px] text-gray-400">
        選擇日期
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full justify-start text-left font-normal focus:outline-none focus:ring-1 focus:ring-ring hover:bg-transparent"
          >
            <CalendarIcon className=" text-gray-500" />
            {date ? formatDate(date) : <span>選擇日期</span>}
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(day) => handleChange(day ?? new Date())}
            initialFocus
            disabled={{ before: new Date() }}
            fromMonth={startMonth}
            toMonth={endMonth}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
