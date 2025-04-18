"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { AdminPayoutFilters } from "@/app/admin/payout/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

const StudioFilter = ({
  filter,
  setFilter,
}: {
  filter: AdminPayoutFilters;
  setFilter: React.Dispatch<React.SetStateAction<AdminPayoutFilters>>;
}) => {
  const { data: studios, isLoading } = useStudios();

  if (isLoading) return null;

  function handleChange(value: string): void {
    if (value === "All") {
      setFilter({ ...filter, studio: "" });
    } else {
      setFilter({ ...filter, studio: value });
    }
  }

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by studio" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"All"}>All</SelectItem>
        {studios?.map((studio) => (
          <SelectItem value={studio.slug} key={studio.slug}>
            {studio.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StudioFilter;

//use react query to fetch data
const useStudios = () =>
  useQuery({
    queryKey: ["studios"],
    queryFn: async () => {
      const res = await fetch(`/api/studios/name`);
      const result = await res.json();
      return result.data.data as { name: string; slug: string }[];
    },
    staleTime: 3 * 24 * 60 * 60 * 1000,
  });
