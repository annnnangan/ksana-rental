"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/tailwind-utils";
import { useState } from "react";

const studioList = [
  {
    studio_name: "Soul Yogi Studio",
    studio_slug: "soul-yogi-studio",
  },
  {
    studio_name: "Olivia Studio",
    studio_slug: "olivia-studio",
  },
  {
    studio_name: "Zen Oasis",
    studio_slug: "zen-oasis",
  },
];

const StudioFilterDropdown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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
            ? studioList.find((studio) => studio.studio_slug === value)
                ?.studio_name
            : "Studio Name"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {studioList.map((studio) => (
                <CommandItem
                  key={studio.studio_slug}
                  value={studio.studio_slug}
                  onSelect={(currentValue: React.SetStateAction<string>) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {studio.studio_name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === studio.studio_slug ? "opacity-100" : "opacity-0"
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
