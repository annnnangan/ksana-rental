import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
  icon: LucideIcon;
  iconSize?: number;
  color?: string;
  fallbackText: string;
  textSize?: string;
}

const SectionFallback = ({ icon: Icon, iconSize = 24, color = "text-gray-400", fallbackText, textSize = "text-md" }: Props) => {
  return (
    <div className={`flex flex-col ${color} items-center ${textSize}`}>
      <Icon size={iconSize} />
      <p>{fallbackText}</p>
    </div>
  );
};

export default SectionFallback;
