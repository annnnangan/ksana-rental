"use client";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { districts } from "@/services/model";
import { MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  updateQueryString: (type: string, value: string) => void;
}

const LocationPicker = ({ updateQueryString }: Props) => {
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<string>(searchParams.get("location") || "");

  useEffect(() => {
    const newLocation = searchParams.get("location") || "";
    setSelectedLocation(newLocation);
  }, [searchParams]);

  const handleChange = (location: string) => {
    setSelectedLocation(location); // Update local state
    updateQueryString("location", location); // Update URL query string
  };

  return (
    <div className="flex flex-col">
      <p className="text-xs rounded-sm mb-1">場地位置:</p>
      <Select value={selectedLocation} onValueChange={handleChange}>
        <SelectTrigger className="w-full bg-white">
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
