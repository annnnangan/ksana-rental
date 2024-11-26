"use client";
import { Button, Flex, RadioGroup, Text } from "@radix-ui/themes";
import { addMinutes, getDay, getMonth, getYear } from "date-fns";
import React, { useState } from "react";
import classNames from "classnames";
import { PriceType } from "@/services/model";

interface Props {
  isAvailable: boolean;
  priceType: PriceType;
  startTime: string;
  isSelected: boolean;
  onSelect: () => void;
}

const priceTypeMap = {
  peak: { buttonColor: "orange", dotColor: "bg-orange-500" },
  "non-peak": { buttonColor: "grass", dotColor: "bg-green-500" },
};

const Timeslot = ({
  isAvailable,
  priceType,
  startTime,
  isSelected,
  onSelect,
}: Props) => {
  var btnGroupClasses = classNames("rounded-full", "w-3", "h-3", {
    "bg-white": isSelected,
    "bg-zinc-300": !isAvailable,
    [priceTypeMap[priceType].dotColor]: !isSelected,
  });

  return (
    <Button
      disabled={!isAvailable}
      size="2"
      variant={!isAvailable ? "outline" : isSelected ? "solid" : "outline"}
      color={priceTypeMap[priceType].buttonColor as any}
      radius="full"
      onClick={onSelect}
    >
      <div className={btnGroupClasses}></div>
      {startTime}
    </Button>
  );
};

export default Timeslot;
