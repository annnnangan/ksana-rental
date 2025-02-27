"use client";
import { Button } from "@/components/shadcn/button";
import { PriceType } from "@/services/model";
import classNames from "classnames";

interface Props {
  isBooked: boolean;
  priceType: PriceType;
  startTime: number;
  isSelected: boolean;
  onSelect: () => void;
}

const priceTypeMap = {
  peak: { solidStyle: "bg-orange-400 hover:bg-orange-400/90", dotColor: "bg-orange-600", outlineStyle: "border-orange-400 hover:bg-orange-400 hover:text-white" },
  "non-peak": { solidStyle: "bg-green-600 hover:bg-green-600/90", dotColor: "bg-green-500", outlineStyle: "border-green-600 hover:bg-green-600 hover:text-white" },
};

const Timeslot = ({ isBooked, priceType, startTime, isSelected, onSelect }: Props) => {
  // Determine the button class names dynamically
  const dotClass = classNames("rounded-full", "w-3", "h-3", {
    "bg-white": isSelected,
    "bg-gray-300": isBooked,
    [priceTypeMap[priceType]?.dotColor]: !isSelected && !isBooked,
  });

  const buttonClass = classNames("rounded-xl", {
    "bg-white": isSelected,
    "border-gray-300 text-gray-400": isBooked,
    [priceTypeMap[priceType]?.outlineStyle]: !isSelected && !isBooked,
    [priceTypeMap[priceType]?.solidStyle]: isSelected && !isBooked,
  });

  return (
    <Button variant={isSelected ? "default" : "outline"} disabled={isBooked} className={buttonClass} onClick={onSelect}>
      <span className={dotClass}></span>
      {startTime}
    </Button>
  );
};

export default Timeslot;
