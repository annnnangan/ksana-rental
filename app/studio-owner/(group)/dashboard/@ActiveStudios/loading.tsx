import { Skeleton } from "@/components/shadcn/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div className="flex gap-2" key={index}>
          <Skeleton className="h-[60px] w-[60px]" />
          <div className="flex flex-col justify-between">
            <div className="space-y-1">
              <Skeleton className="h-[10px] w-[80px]" />
              <Skeleton className="h-[10px] w-[80px]" />
            </div>

            <Skeleton className="h-[10px] w-[80px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default loading;
