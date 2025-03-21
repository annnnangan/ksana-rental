"use client";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Clock5 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  updateQueryString: (type: string, value: string) => void;
  isHideEndTime?: boolean;
}

const TimePicker = ({ updateQueryString, isHideEndTime = false }: Props) => {
  const searchParams = useSearchParams();

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
    updateQueryString(type, value);
  };

  return (
    <div>
      <div className="flex flex-col flex-wrap">
        <p className="text-xs rounded-sm mb-1">為你尋找在範圍內有 1 小時空檔的場地:</p>
        <div className="flex space-x-3">
          {/* Start Time Picker */}
          <Select defaultValue={validateTimeParams("startTime")} onValueChange={(value) => handleTimeChange("startTime", value)}>
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

          {!isHideEndTime && (
            <>
              {/* End Time Picker */}
              <Select defaultValue={validateTimeParams("endTime")} onValueChange={(value) => handleTimeChange("endTime", value)} disabled={!startTime}>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
