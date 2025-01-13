import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface Props {
  peakHourPrice: number;
  nonPeakHourPrice: number;
}

const SideSection = ({ peakHourPrice, nonPeakHourPrice }: Props) => {
  return (
    <div className="p-5 border border-primary rounded-md sticky top-20">
      <div className="flex flex-col gap-2 mb-5">
        <div className="ps-3 py-2 border border-primary rounded-md basis-1/3">
          <p className="text-xs text-gray-500">繁忙時間 / Peak Hour</p>
          <p className="text-lg">HK$ {[[peakHourPrice]]}</p>
        </div>

        <div className="ps-3 py-2 border border-primary rounded-md basis-1/3">
          <p className="text-xs text-gray-500">非繁忙時間 / Non-Peak Hour</p>
          <p className="text-lg">HK$ {[[nonPeakHourPrice]]}</p>
        </div>
      </div>
      <Button type="button" className="w-full">
        <Link href="/booking/date-time?studio=">立即預約</Link>
      </Button>
    </div>
  );
};

export default SideSection;
