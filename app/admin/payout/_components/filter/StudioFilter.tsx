"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { cn } from "@/lib/utils/tailwind-utils";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const StudioFilterDropdown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { data: studios, error, isLoading } = useStudios();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? studios?.find((studio) => studio.slug === value)?.name
            : "Studio Name"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search studios..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Studios Found.</CommandEmpty>
            <CommandGroup>
              {studios?.map((studio) => (
                <CommandItem
                  key={studio.slug}
                  value={studio.slug}
                  onSelect={(currentValue: React.SetStateAction<string>) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    const currentParams = new URLSearchParams(
                      searchParams?.toString() || ""
                    );

                    currentParams.set("studio", currentValue as string);
                    if (currentValue === value) currentParams.delete("studio");
                    router.push(`?${currentParams.toString()}`);
                  }}
                >
                  {studio.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === studio.slug ? "opacity-100" : "opacity-0"
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

export default StudioFilterDropdown;

//use react query to fetch data
const useStudios = () =>
  useQuery({
    queryKey: ["studios"],
    queryFn: async () => {
      const res = await fetch(`/api/studio`);
      const result = await res.json();
      return result.data as { name: string; slug: string }[];
    },
    staleTime: 3 * 24 * 60 * 60 * 1000,
  });
