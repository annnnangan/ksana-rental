import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { CircleHelp } from "lucide-react";
import { Skeleton } from "@/components/shadcn/skeleton";

const ScoreCard = ({
  metricName,
  value,
  toolTipContent,
  isLoading = false,
  isRevenue = false,
}: {
  metricName: string;
  value: number;
  toolTipContent: React.ReactNode;
  isLoading: boolean;
  isRevenue?: boolean;
}) => {
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
        {isLoading ? (
          <Skeleton className="w-full h-4 mt-2" />
        ) : (
          <p className="font-bold">
            {isRevenue && "$ "} {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
