"use client";
import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { Label } from "@/components/shadcn/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { equipmentMap } from "@/lib/constants/studio-details";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";

import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  updateQueryString: (type: string, value: string) => void;
}

const DatePicker = ({ updateQueryString }: Props) => {
  const searchParams = useSearchParams();

  const [date, setDate] = useState<Date | undefined>(searchParams.get("date") !== null ? new Date(searchParams.get("date")!) : undefined);

  const [startMonth, setStartMonth] = useState<Date>();
  const [endMonth, setEndMonth] = useState<Date>();

  useEffect(() => {
    // Get today's date
    const today = new Date();
    // Calculate the start and end months
    setStartMonth(new Date(today.getFullYear(), today.getMonth(), 1)); // First day of current month
    setEndMonth(new Date(today.getFullYear(), today.getMonth() + 2, 0)); // Last day of two months later
  }, []);

  const handleChange = (day: Date | undefined) => {
    if (day === undefined) {
      setDate(undefined);
      updateQueryString("date", "");
    } else {
      setDate(day);
      updateQueryString("date", formatDate(day));
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-xs rounded-sm mb-1">預約日期:</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} className="w-full justify-start text-left font-normal focus:outline-none focus:ring-1 focus:ring-ring">
            <CalendarIcon className=" text-gray-500" />
            {date ? formatDate(date) : <span>選擇日期</span>}
            <ChevronDown className="h-4 w-4 text-gray-500 ms-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full" align="start">
          <Calendar mode="single" selected={date} onSelect={(day) => handleChange(day)} initialFocus disabled={{ before: new Date() }} fromMonth={startMonth} toMonth={endMonth} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DatePicker;
