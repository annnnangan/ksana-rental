import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { CircleHelp } from "lucide-react";

const ScoreCard = ({ metricName, value, toolTipContent }: { metricName: string; value: number; toolTipContent: React.ReactNode }) => {
  return (
    <Card className="border-gray-200">
      <CardHeader className="px-3 pt-4 pb-0 flex flex-row items-start">
        <CardTitle className="text-gray-500 text-sm font-medium">{metricName}</CardTitle>
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
      <CardContent className="px-3 pt-0 pb-4 text-2xl">
        <p className="font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
