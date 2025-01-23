import {
  getDistrictLabelByDistrictValue,
  findAreaByDistrictValue,
} from "@/lib/utils/areas-districts-converter";
import { MapPin } from "lucide-react";
import React from "react";

interface Props {
  district: string;
}

const StudioLocation = ({ district }: Props) => {
  return (
    <div className="flex items-center">
      <MapPin size={14} className="me-1" fill="#01a2c7" strokeWidth={0} />
      <p className="text-sm">
        {getDistrictLabelByDistrictValue(district) +
          ", " +
          findAreaByDistrictValue(district)?.label}
      </p>
    </div>
  );
};

export default StudioLocation;
