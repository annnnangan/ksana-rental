"use client";
import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";

import { CalendarIcon, ChevronDown, Clock5 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage";

const DateTimePicker = ({ isModal }: { isModal: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [date, setDate] = useState<Date | undefined>(searchParams.get("date") !== null ? new Date(searchParams.get("date")!) : undefined);

  const [startMonth, setStartMonth] = useState<Date>();
  const [endMonth, setEndMonth] = useState<Date>();
  const [error, setError] = useState("");

  // Generate the time options
  const startTimeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const endTimeOptions = Array.from({ length: 25 }, (_, i) => {
    const hour = i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  // Validate the startTime and endTime search params
  const validateTimeParams = (type: string) => {
    const timeRange = type === "startTime" ? startTimeOptions : endTimeOptions;

    if (searchParams.get("startTime") && searchParams.get("endTime") && searchParams.get("endTime")! < searchParams.get("startTime")! && type === "endTime") {
      return "";
    } else {
      return timeRange.includes(searchParams.get(type) + ":00") ? searchParams.get(type) + ":00" : "";
    }
  };

  const [startTime, setStartTime] = useState<string>(validateTimeParams("startTime"));
  const [endTime, setEndTime] = useState<string>(validateTimeParams("endTime"));

  useEffect(() => {
    const newStartTime = searchParams.get("startTime") || "";
    setStartTime(validateTimeParams("startTime"));
    const newEndTime = searchParams.get("endTime") || "";
    setEndTime(validateTimeParams("endTime"));
  }, [searchParams]);

  // Dynamically filter end time options based on selected start time
  // Only return endHour when it is later than startHour
  const filteredEndOptions = endTimeOptions.filter((time) => {
    if (!startTime) return true; // Allow all valid end times if no start time is selected
    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(time.split(":")[0], 10);
    return endHour > startHour;
  });

  const handleTimeChange = (type: string, value: string) => {
    if (type === "startTime") {
      setStartTime(value);

      // Reset endTime if it's invalid
      if (endTime && parseInt(endTime.split(":")[0], 10) <= parseInt(value.split(":")[0], 10)) {
        setEndTime("");
      }
    } else if (type === "endTime") {
      setEndTime(value);

      // Ensure endTime is not before startTime
      if (startTime && parseInt(value.split(":")[0], 10) <= parseInt(startTime.split(":")[0], 10)) {
        setEndTime(""); // Reset if invalid
      }
    }
  };

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
    if (day === undefined) {
      setDate(undefined);
    } else {
      setDate(day);
    }
  };

  const handleCancelDateTimeFilter = () => {
    const params = new URLSearchParams(searchParams);
    setDate(undefined);
    setStartTime("");
    setEndTime("");

    params.delete("page");
    params.delete("date");
    params.delete("startTime");
    params.delete("endTime");
    const query = params.size ? "?" + params.toString() : "";
    router.push("/explore-studios" + query);
  };

  const handleSetDateTimeFilter = () => {
    if (date && startTime && endTime) {
      const params = new URLSearchParams(searchParams);
      params.delete("page");
      params.set("date", formatDate(date));
      params.set("startTime", startTime.split(":")[0]);
      params.set("endTime", endTime.split(":")[0]);
      const query = params.size ? "?" + params.toString() : "";
      router.push("/explore-studios" + query);
    } else {
      setError("請選擇日期及時間。");
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-xs rounded-sm mb-1">預約日期及時間:</p>

      {!isModal && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="w-full justify-start text-left font-normal focus:outline-none focus:ring-1 focus:ring-ring">
              <CalendarIcon className=" text-gray-500" />
              {date ? `${formatDate(date)} ${startTime} ${endTime ? `- ${endTime}` : ""}` : <span>選擇日期及時間</span>}
              <ChevronDown className="h-4 w-4 text-gray-500 ms-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="px-4 pt-5 flex flex-col sm:flex-row" align="start">
            <Calendar mode="single" selected={date} onSelect={(day) => handleChange(day)} initialFocus disabled={{ before: new Date() }} fromMonth={startMonth} toMonth={endMonth} />
            <div className="flex flex-col flex-wrap">
              <p className="text-xs rounded-sm mb-1">為你尋找在範圍內有 1 小時空檔的場地:</p>
              <div className="flex flex-col space-y-3">
                {/* Start Time Picker */}
                <Select value={startTime} onValueChange={(value) => handleTimeChange("startTime", value)}>
                  <SelectTrigger className="w-full bg-white">
                    <div className="flex items-center gap-2">
                      <Clock5 size={16} className="text-gray-500" />
                      <SelectValue placeholder="選擇開始時間" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {startTimeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* End Time Picker */}
                <Select value={endTime} onValueChange={(value) => handleTimeChange("endTime", value)} disabled={!startTime}>
                  <SelectTrigger className="w-full bg-white">
                    <div className="flex items-center gap-2">
                      <Clock5 size={16} className="text-gray-500" />
                      <SelectValue placeholder="選擇完結時間" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEndOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="ms-auto mt-auto mb-3 ">
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleCancelDateTimeFilter}>
                    重新設定
                  </Button>
                  <Button type="button" size="sm" disabled={!date || !startTime || !endTime} onClick={handleSetDateTimeFilter}>
                    設定日期時間
                  </Button>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {isModal && (
        <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-5 p-5 border border-gray-200 shadow rounded-lg">
          <div className="flex">
            <Calendar mode="single" selected={date} onSelect={(day) => handleChange(day)} initialFocus disabled={{ before: new Date() }} fromMonth={startMonth} toMonth={endMonth} />
          </div>

          <div className="flex flex-col flex-wrap">
            <p className="text-xs rounded-sm mb-1">為你尋找在範圍內有 1 小時空檔的場地:</p>
            <div className="flex flex-col mb-5 space-y-3 space-x-0">
              {/* Start Time Picker */}
              <Select value={startTime} onValueChange={(value) => handleTimeChange("startTime", value)}>
                <SelectTrigger className="w-full bg-white">
                  <div className="flex items-center gap-2">
                    <Clock5 size={16} className="text-gray-500" />
                    <SelectValue placeholder="選擇開始時間" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {startTimeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* End Time Picker */}
              <Select value={endTime} onValueChange={(value) => handleTimeChange("endTime", value)} disabled={!startTime}>
                <SelectTrigger className="w-full bg-white">
                  <div className="flex items-center gap-2">
                    <Clock5 size={16} className="text-gray-500" />
                    <SelectValue placeholder="選擇完結時間" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {filteredEndOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ms-auto mt-auto mb-3 ">
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancelDateTimeFilter}>
                  重新設定
                </Button>
                <Button type="button" size="sm" disabled={!date || !startTime || !endTime} onClick={handleSetDateTimeFilter}>
                  設定日期時間
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
