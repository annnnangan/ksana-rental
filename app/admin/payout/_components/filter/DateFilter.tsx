"use client";

import { endOfWeek, format, startOfWeek, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate, getLastMonday } from "@/lib/utils/date-time-utils";
import { cn } from "@/lib/utils/tailwind-utils";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  defaultStartDate: Date;
  defaultEndDate: Date;
}

const DateFilter = ({ defaultStartDate, defaultEndDate }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedWeek, setSelectedWeek] = useState<DateRange>({
    from: defaultStartDate,
    to: defaultEndDate,
  });

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selectedWeek && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {selectedWeek?.from ? (
              selectedWeek.to ? (
                <>
                  {format(selectedWeek.from, "LLL dd, y")} -{" "}
                  {format(selectedWeek.to, "LLL dd, y")}
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
              const searchParams = new URLSearchParams();
              searchParams.set(
                "startDate",
                formatDate(startOfWeek(day, { weekStartsOn: 1 }))
              );
              searchParams.set(
                "endDate",
                formatDate(endOfWeek(day, { weekStartsOn: 1 }))
              );
              router.push(`?${searchParams.toString()}`);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilter;
