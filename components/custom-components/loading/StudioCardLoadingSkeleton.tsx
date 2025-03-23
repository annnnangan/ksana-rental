import { Skeleton } from "@/components/shadcn/skeleton";
import React from "react";

const StudioCardLoadingSkeleton = () => {
  return (
    <div>
      <Skeleton className="aspect-[3/1]" />
      <div className="-mt-6 ml-3 mb-1 flex items-end gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="mt-4 space-y-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

export default StudioCardLoadingSkeleton;
