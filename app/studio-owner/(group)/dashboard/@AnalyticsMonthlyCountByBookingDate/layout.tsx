import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { CircleHelp } from "lucide-react";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="border-gray-300">
      <CardHeader className="pb-1 space-y-1 md:space-y-1.5 flex flex-row items-start">
        <CardTitle className="text-sm md:text-base text-primary">
          預約數量 <span className="text-[10px] md:text-[12px]">(按預約完成日期計算)</span>
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CircleHelp size={15} className="ms-1 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs md:text-sm ">
                <p>計算方式</p>
                <p>根據「預約完成日期」，統計符合以下條件的預約數量，並根據預約完成日期按月份分類：</p>
                <p>1. 即將開始的預約</p>
                <p>2. 已完成的預約</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="pt-2 md:pt-1 space-y-5">{children}</CardContent>
    </Card>
  );
};

export default layout;
