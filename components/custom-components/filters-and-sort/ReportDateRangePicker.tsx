"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ReportDateRangePicker = ({ parentPagePath }: { parentPagePath: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDateRange, setSelectedDateRange] = useState<string>(searchParams.get("dateRange") || "last-6-months");

  useEffect(() => {
    const newLocation = searchParams.get("dateRange") || "";
    setSelectedDateRange(newLocation);
  }, [searchParams]);

  const handleChange = (dateRange: string) => {
    setSelectedDateRange(dateRange);
    const params = new URLSearchParams(searchParams);
    params.set("dateRange", dateRange);
    const query = params.size ? "?" + params.toString() : "";
    router.push(parentPagePath + query);
  };
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">報告時間範圍</p>
      <Select defaultValue={selectedDateRange} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px] mb-5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this-month">本月</SelectItem>
          <SelectItem value="last-6-months">過去6個月</SelectItem>
          <SelectItem value="last-12-months">過去12個月</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReportDateRangePicker;
