"use client";
import SectionFallback from "@/components/custom-components/common/SectionFallback";
import { Frown } from "lucide-react";
import React from "react";

const error = () => {
  return (
    <div>
      <SectionFallback icon={Frown} fallbackText={"無法取得資料"} />
    </div>
  );
};

export default error;
