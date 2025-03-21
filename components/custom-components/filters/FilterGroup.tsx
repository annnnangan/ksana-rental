"use client";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { StudioQuery } from "../../../app/(user)/explore-studios/page";
import DatePicker from "./DatePicker";
import EquipmentPicker from "./EquipmentPicker";
import LocationPicker from "./LocationPicker";
import TimePicker from "./TimePicker";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface Props {
  isHideEndTime?: boolean;
}

const FilterGroup = ({ isHideEndTime = false }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpenFilterModal, setOpenFilterModal] = useState(false);
  const [filters, setFilters] = useState<StudioQuery>({
    location: searchParams.get("location") || "",
    date: searchParams.get("date") || "",
    startTime: searchParams.get("startTime") || "",
    endTime: searchParams.get("endTime") || "",
    equipment: searchParams.get("equipment") || "",
  });

  const updateQueryString = (type: string, value: string | undefined) => {
    const params = new URLSearchParams();

    // Define the prioritized order for parameters
    const orderedKeys: Array<keyof StudioQuery> = ["location", "date", "startTime", "endTime", "equipment"];

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
        } else if (value === "") {
          params.delete(key);
        } else {
          params.set(key, updatedSearchParams[key]!);
        }
      }
    });

    // Build and push the query string
    const query = params.toString() ? `?${params.toString()}` : "";
    router.push(`/explore-studios${query}`);
  };

  const handleCloseModal = () => {
    setOpenFilterModal(false);
  };

  return (
    <>
      <div className="lg:flex gap-2 md:gap-5 hidden">
        <LocationPicker updateQueryString={updateQueryString} />
        <DatePicker updateQueryString={updateQueryString} />
        <TimePicker updateQueryString={updateQueryString} isHideEndTime={isHideEndTime} />
        <EquipmentPicker isModal={false} updateQueryString={updateQueryString} />
      </div>
      <div className="block lg:hidden">
        <Button variant="outline" className="border-primary" onClick={() => setOpenFilterModal(true)}>
          <Filter className="mr-1 h-4 w-4" />
          場地篩選
        </Button>
        <Dialog open={isOpenFilterModal}>
          <DialogContent hideClose className="p-0 max-h-[90vh] overflow-y-auto">
            <X onClick={handleCloseModal} className="cursor-pointer w-5 h-5 text-gray-500 absolute top-0 right-0 me-5 mt-5" />
            <DialogHeader className="px-5 pt-8">
              <DialogTitle>場地篩選</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="px-5 pb-8 space-y-5">
              <LocationPicker updateQueryString={updateQueryString} />
              <DatePicker updateQueryString={updateQueryString} />
              <TimePicker updateQueryString={updateQueryString} isHideEndTime={isHideEndTime} />
              <EquipmentPicker isModal={true} updateQueryString={updateQueryString} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default FilterGroup;
