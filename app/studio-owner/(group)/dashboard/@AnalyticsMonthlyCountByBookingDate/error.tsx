"use client";
import SectionFallback from "@/components/custom-components/SectionFallback";
import { Frown } from "lucide-react";

const error = () => {
  return (
    <div>
      <SectionFallback icon={Frown} fallbackText={"無法取得資料"} />
    </div>
  );
};

export default error;
