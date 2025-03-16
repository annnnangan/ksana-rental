import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
  icon: LucideIcon;
  size?: number;
  color?: string;
  fallbackText: string;
}

const SectionFallback = ({ icon: Icon, size = 24, color = "text-gray-400", fallbackText }: Props) => {
  return (
    <div className={`flex flex-col ${color} items-center`}>
      <Icon size={size} />
      <p>{fallbackText}</p>
    </div>
  );
};

export default SectionFallback;
