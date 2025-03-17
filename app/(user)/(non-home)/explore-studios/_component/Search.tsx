"use client";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "./DatePicker";
import LocationPicker from "./LocationPicker";
import TimePicker from "./TimePicker";
import { StudioQuery } from "../page";

interface Props {
  isHideEndTime?: boolean;
}

const SearchFilter = ({ isHideEndTime = false }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQueryString = (type: string, value: string) => {
    const params = new URLSearchParams();

    // Define the prioritized order for parameters
    const orderedKeys: Array<keyof StudioQuery> = ["location", "date", "startTime", "endTime"];

    // Create an object to store updated search parameters
    const updatedSearchParams: Partial<StudioQuery> = {};

    // Update the parameter being changed
    orderedKeys.forEach((key) => {
      if (key === type && value) {
        updatedSearchParams[key] = key === "startTime" || key === "endTime" ? value.split(":")[0] : value;
      } else {
        const currentValue = searchParams.get(key);
        if (currentValue) {
          updatedSearchParams[key] = currentValue;
        }
      }
    });

    // Add parameters to `params` in the prioritized order
    orderedKeys.forEach((key) => {
      if (updatedSearchParams[key]) {
        if (type === "location" && value === "all" && key === "location") {
          params.delete("location");
        } else {
          params.set(key, updatedSearchParams[key]!);
        }
      }
    });

    // Build and push the query string
    const query = params.toString() ? `?${params.toString()}` : "";
    router.push(`/explore-studios${query}`);
  };

  return (
    <div className="mb-9 flex flex-wrap gap-5 items-center justify-center">
      <LocationPicker updateQueryString={updateQueryString} />
      <DatePicker updateQueryString={updateQueryString} />
      <TimePicker updateQueryString={updateQueryString} isHideEndTime={isHideEndTime} />
    </div>
  );
};

export default SearchFilter;
