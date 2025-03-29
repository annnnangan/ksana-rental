import { StudioInfo } from "@/app/(user)/(group)/studio/[slug]/page";
import StudioLocation from "@/components/custom-components/studio/StudioLocation";
import StudioLogo from "@/components/custom-components/studio/StudioLogo";
import StudioRating from "@/components/custom-components/studio/StudioRating";
import { Phone } from "lucide-react";

import BookmarkButton from "./BookmarkButton";

type BasicStudioInfo = Pick<StudioInfo, "slug" | "name" | "logo" | "district" | "phone" | "rating" | "number_of_review" | "number_of_completed_booking">;

interface Props {
  basicInfo: BasicStudioInfo;
}

const BasicInfo = ({ basicInfo: { slug, name, logo, district, phone, rating, number_of_review, number_of_completed_booking } }: Props) => {
  return (
    <section className="mt-5">
      <div className="flex justify-end">
        <BookmarkButton studioSlug={slug} />
      </div>
      <div className="flex items-center flex-col md:flex-row md:justify-start gap-4 -mt-4">
        <StudioLogo logo={logo} size="md" />
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-lg font-bold">{name}</h2>

          <div className="mb-2 flex flex-col items-center md:items-start">
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
    </section>
  );
};

export default BasicInfo;
