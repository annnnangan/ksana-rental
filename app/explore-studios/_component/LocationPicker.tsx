"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { districts } from "@/services/model";
import { MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Props {
  updateQueryString: (type: string, value: string) => void;
}

const LocationPicker = ({ updateQueryString }: Props) => {
  const searchParams = useSearchParams();

  const handleChange = (location: string) => {
    updateQueryString("location", location);
  };

  return (
    <div className="flex flex-col">
      <Label htmlFor="location" className="text-[11px] text-gray-400">
        選擇場地地區
      </Label>

      <Select
        defaultValue={searchParams.get("location") || ""}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <SelectValue placeholder="選擇場地地區" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">所有地區</SelectItem>
          {districts.map((item) => (
            <SelectGroup key={item.area.value}>
              <SelectLabel>---- {item.area.label} ----</SelectLabel>
              {item.district.map((location) => (
                <SelectItem value={location.value} key={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationPicker;
