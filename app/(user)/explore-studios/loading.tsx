import { Skeleton } from "@/components/shadcn/skeleton";
import React from "react";

const ExploreStudiosLoading = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index}>
          <Skeleton className="aspect-[3/1]" />
          <div className="-mt-6 ml-3 mb-1 flex items-end gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="mt-4 space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExploreStudiosLoading;
