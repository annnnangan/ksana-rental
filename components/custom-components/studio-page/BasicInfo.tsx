import { StudioInfo } from "@/app/(user)/(non-home)/studio/[slug]/page";
import StudioLocation from "@/components/custom-components/studio/StudioLocation";
import StudioLogo from "@/components/custom-components/studio/StudioLogo";
import StudioRating from "@/components/custom-components/studio/StudioRating";
import { Bookmark, Phone } from "lucide-react";

type BasicStudioInfo = Pick<StudioInfo, "name" | "logo" | "district" | "phone" | "rating" | "number_of_review" | "number_of_completed_booking">;

interface Props {
  basicInfo: BasicStudioInfo;
}

const BasicInfo = ({ basicInfo: { name, logo, district, phone, rating, number_of_review, number_of_completed_booking } }: Props) => {
  return (
    <section className="flex justify-between gap-x-2 mt-5">
      <div className="flex justify-center items-center gap-4 flex-wrap">
        <StudioLogo logo={logo} size="md" />
        <div>
          <h2 className="text-lg font-bold">{name}</h2>

          <div className="mb-2">
            {/* Location */}
            <StudioLocation district={district} />
            {/* Rate */}
            <StudioRating rating={rating} numberOfReview={number_of_review} numberOfCompletedBooking={number_of_completed_booking} />
            {/* phone */}
            <div className="flex items-center">
              <Phone size={14} className="me-1" fill="#01a2c7" strokeWidth={0} />

              <a className="text-sm me-2" href={`tel:${phone}`}>
                {phone}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button className="p-2 bg-white rounded-full shadow-lg">
          <Bookmark className="text-gray-700" size={16} />
        </button>
      </div>
    </section>
  );
};

export default BasicInfo;
