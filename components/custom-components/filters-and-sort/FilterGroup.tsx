"use client";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import DateTimePicker from "./DateTimePicker";
import EquipmentPicker from "./EquipmentPicker";
import LocationPicker from "./LocationPicker";
import LoadingSpinner from "../common/loading/LoadingSpinner";

const FilterGroup = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FilterGroupContent />
    </Suspense>
  );
};

const FilterGroupContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpenFilterModal, setOpenFilterModal] = useState(false);

  const handleCloseModal = () => {
    setOpenFilterModal(false);
  };

  const handleRest = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("date");
    params.delete("location");
    params.delete("startTime");
    params.delete("endTime");
    params.delete("equipment");
    params.delete("page");
    const query = params.size ? "?" + params.toString() : "";
    router.push("/explore-studios" + query);
  };

  return (
    <>
      <div className="md:flex gap-2 hidden">
        <LocationPicker />
        <DateTimePicker isModal={false} />
        <EquipmentPicker isModal={false} />
        <Button variant="ghost" className="text-gray-500 mt-auto" size="sm" onClick={handleRest}>
          <X />
          重設
        </Button>
      </div>
      <div className="block md:hidden">
        <Button
          variant="outline"
          className="border-primary"
          onClick={() => setOpenFilterModal(true)}
        >
          <Filter className="mr-1 h-4 w-4" />
          場地篩選
        </Button>
        <Dialog open={isOpenFilterModal}>
          <DialogContent hideClose className="p-0 h-[90vh] flex flex-col overflow-scroll">
            <X
              onClick={handleCloseModal}
              className="cursor-pointer w-5 h-5 text-gray-500 absolute top-0 right-0 me-5 mt-5"
            />

            <DialogHeader className="px-5 pt-8">
              <DialogTitle>場地篩選</DialogTitle>
              <Button
                type="button"
                variant="ghost"
                className="text-gray-500 text-start"
                size="sm"
                onClick={handleRest}
              >
                <X />
                重設
              </Button>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="px-5 pb-8 space-y-5 ">
              <LocationPicker />
              <EquipmentPicker isModal={true} />
              <DateTimePicker isModal={true} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default FilterGroup;
