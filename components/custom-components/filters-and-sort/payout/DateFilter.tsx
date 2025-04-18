"use client";

import { endOfWeek, format, startOfWeek, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";

import { cn } from "@/lib/utils/tailwind-utils";

interface Props {
  selectedWeek: DateRange;
  setSelectedWeek: ({ from, to }: { from: Date; to: Date }) => void;
}

const DateFilter = ({ selectedWeek, setSelectedWeek }: Props) => {
  const maxCalendarDate = subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 8);

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
                  {format(selectedWeek.from, "LLL dd, y")} - {format(selectedWeek.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedWeek.from, "LLL dd, y")
              )
            ) : (
              <span>選擇結算時段</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            modifiers={{
              selected: selectedWeek!,
              range_start: selectedWeek.from!,
              range_end: selectedWeek.to!,
            }}
            disabled={{ after: maxCalendarDate }}
            onDayClick={(day) => {
              setSelectedWeek({
                from: startOfWeek(day, { weekStartsOn: 1 }),
                to: endOfWeek(day, { weekStartsOn: 1 }),
              });
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilter;
