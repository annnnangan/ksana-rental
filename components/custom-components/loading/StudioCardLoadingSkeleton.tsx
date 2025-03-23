import { Skeleton } from "@/components/shadcn/skeleton";
import React from "react";

const StudioCardLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 overflow-x-scroll">
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index}>
          <Skeleton className="aspect-[3/1]" />
          <div className="-mt-6 ml-3 mb-1 flex items-end gap-4">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="mt-4 space-y-1">
            <Skeleton className="h-4 w-5" />
            <Skeleton className="h-4 w-5" />
            <Skeleton className="h-4 w-5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudioCardLoadingSkeleton;
