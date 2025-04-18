"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { Button } from "@/components/shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { cn } from "@/lib/utils/tailwind-utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import AvatarWithFallback from "../common/AvatarWithFallback";

type StudioNameFilterProps<T> = {
  filter: T;
  setFilter: React.Dispatch<React.SetStateAction<T>>;
  filterKey: keyof T;
  studioStatus?: "all" | "active";
};

const StudioNameFilter = <T,>({
  filter,
  setFilter,
  filterKey,
  studioStatus = "all",
}: StudioNameFilterProps<T>) => {
  const [open, setOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState(filter[filterKey] ? filter[filterKey] : "");

  const { data: studios } = useStudioFilter(studioStatus);

  useEffect(() => {
    setSelectedStudio(filter[filterKey] ?? "");
  }, [filter, filterKey]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between h-fit"
        >
          {selectedStudio ? (
            <>
              <AvatarWithFallback
                //@ts-expect-error expected
                avatarUrl={studios?.find((studio) => studio?.value == selectedStudio)?.logo}
                type={"studio"}
              />
              {studios?.find((studio) => studio?.value == selectedStudio)?.label}
            </>
          ) : (
            "Select Studio..."
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search studios..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Studios Found.</CommandEmpty>
            <CommandGroup>
              {studios?.map((studio) => (
                <CommandItem
                  className="cursor-pointer"
                  key={studio.value}
                  value={studio.value}
                  onSelect={(currentValue) => {
                    console.log(currentValue);
                    const studioId = currentValue.split("-")[0];
                    if (studioId == selectedStudio) {
                      setFilter({ ...filter, [filterKey]: "" });
                      setSelectedStudio("");
                    } else {
                      setSelectedStudio(studioId);
                      setFilter({
                        ...filter,
                        [filterKey]: studioId,
                      });
                    }

                    setOpen(false);
                  }}
                >
                  <span className="sr-only">{studio.value}-</span>
                  <AvatarWithFallback avatarUrl={studio?.logo} type={"studio"} />
                  {studio?.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedStudio === studio?.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StudioNameFilter;

//use react query to fetch data
const useStudioFilter = (status: "all" | "active") =>
  useQuery({
    queryKey: ["studios", "filter", status],
    queryFn: async () => {
      const res = await fetch(`/api/studios/name?status=${status}`);
      const result = await res.json();
      return result.data.data as { label: string; value: string; logo: string }[];
    },
    staleTime: 3 * 24 * 60 * 60 * 1000,
  });
