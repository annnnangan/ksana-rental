"use client";
import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";

import { CalendarIcon, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DatePicker = () => {
  const router = useRouter();
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

  useEffect(() => {
    const newDate = searchParams.get("date") !== null ? new Date(searchParams.get("date")!) : undefined;
    setDate(newDate);
  }, [searchParams]);

  const handleChange = (day: Date | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (day === undefined) {
      setDate(undefined);
      params.delete("date");
    } else {
      setDate(day);
      params.set("date", formatDate(day));
    }

    params.delete("page");

    const query = params.size ? "?" + params.toString() : "";
    router.push("/explore-studios" + query);
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
