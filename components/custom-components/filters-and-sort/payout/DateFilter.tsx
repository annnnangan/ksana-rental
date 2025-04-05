"use client";

import { endOfWeek, format, startOfWeek, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";

import { cn } from "@/lib/utils/tailwind-utils";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";

interface Props {
  defaultStartDate: Date;
  defaultEndDate: Date;
}

const DateFilter = ({ defaultStartDate, defaultEndDate }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedWeek, setSelectedWeek] = useState<DateRange>({
    from: searchParams.get("startDate") ? new Date(searchParams.get("startDate") as string) : defaultStartDate,
    to: searchParams.get("endDate") ? new Date(searchParams.get("endDate") as string) : defaultEndDate,
  });

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button id="date" variant={"outline"} className={cn("w-[300px] justify-start text-left font-normal", !selectedWeek && "text-muted-foreground")}>
            <CalendarIcon />
            {selectedWeek?.from ? (
              selectedWeek.to ? (
                <>
                  {format(selectedWeek.from, "LLL dd, y")} - {format(selectedWeek.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedWeek.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            modifiers={{
              selected: selectedWeek!,
              range_start: selectedWeek?.from!,
              range_end: selectedWeek?.to!,
            }}
            disabled={{ after: defaultEndDate }}
            onDayClick={(day, modifiers) => {
              setSelectedWeek({
                from: startOfWeek(day, { weekStartsOn: 1 }),
                to: endOfWeek(day, { weekStartsOn: 1 }),
              });
              const currentParams = new URLSearchParams(searchParams?.toString());
              currentParams.set("startDate", formatDate(startOfWeek(day, { weekStartsOn: 1 })));
              currentParams.set("endDate", formatDate(endOfWeek(day, { weekStartsOn: 1 })));
              router.push(`?${currentParams.toString()}`);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilter;
