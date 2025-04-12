import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { CircleHelp } from "lucide-react";

const ChartCard = ({ chart, cardTitle, toolTipContent }: { chart: React.ReactNode; cardTitle: string; toolTipContent: React.ReactNode }) => {
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-1 px-3 pt-3 space-y-1 md:space-y-1.5 flex flex-row items-start">
        <CardTitle className="text-sm md:text-base text-primary">{cardTitle}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CircleHelp size={13} className="ms-1 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs md:text-sm ">{toolTipContent}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="pt-2 md:pt-1 pb-3 px-3 space-y-5">{chart}</CardContent>
    </Card>
  );
};

export default ChartCard;
