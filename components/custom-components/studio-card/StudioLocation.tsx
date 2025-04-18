import {
  getDistrictLabelByDistrictValue,
  findAreaByDistrictValue,
} from "@/lib/utils/areas-districts-converter";
import { MapPin } from "lucide-react";
import React from "react";

interface Props {
  district: string;
  iconSize?: number;
  textSize?: string;
}

const StudioLocation = ({
  district,
  iconSize = 14,
  textSize = "text-sm",
}: Props) => {
  return (
    <div className="flex items-center">
      <MapPin size={iconSize} className="me-1" fill="#01a2c7" strokeWidth={0} />
      <p className={textSize}>
        {getDistrictLabelByDistrictValue(district) +
          ", " +
          findAreaByDistrictValue(district)?.label}
      </p>
    </div>
  );
};

export default StudioLocation;
