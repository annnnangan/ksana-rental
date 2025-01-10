import StudioLocation from "@/app/_components/studio/StudioLocation";
import StudioLogo from "@/app/_components/studio/StudioLogo";
import StudioRating from "@/app/_components/studio/StudioRating";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  getDistrictLabelByDistrictValue,
  findAreaByDistrictValue,
} from "@/lib/utils/areas-districts-converter";
import { MapPin, Star } from "lucide-react";
import React from "react";

interface BasicInfo {
  name: string;
  logo: string;
  district: string;
  contact: string;
  rating: number;
  number_of_review: number;
  number_of_completed_booking: number;
}

interface Props {
  basicInfo: BasicInfo;
}

const BasicInfo = ({
  basicInfo: {
    name,
    logo,
    district,
    contact,
    rating,
    number_of_review,
    number_of_completed_booking,
  },
}: Props) => {
  return (
    <section className="flex gap-x-2">
      <div className="flex justify-center items-center gap-4">
        <StudioLogo logo={logo} />
        <div>
          <h2 className="text-lg font-bold">{name}</h2>

          <div className="mb-2">
            {/* Location */}
            <StudioLocation district={district} />
            {/* Rate */}
            <StudioRating
              rating={rating}
              numberOfReview={number_of_review}
              numberOfCompletedBooking={number_of_completed_booking}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
