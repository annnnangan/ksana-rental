import React from "react";
import { Skeleton } from "@/components/shadcn/skeleton";

// From Gordon: Again, good to have loading page.
const StudioPageLoading = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-60" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-[250px]" />
      <Skeleton className="h-[250px]" />
      <Skeleton className="h-[250px]" />
      <Skeleton className="h-[250px]" />
      <Skeleton className="h-[250px]" />
      <Skeleton className="h-[250px]" />
    </div>
  );
};

export default StudioPageLoading;
