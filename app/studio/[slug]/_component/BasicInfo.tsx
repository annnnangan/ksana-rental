import StudioLocation from "@/app/_components/studio/StudioLocation";
import StudioLogo from "@/app/_components/studio/StudioLogo";
import StudioRating from "@/app/_components/studio/StudioRating";
import { Bookmark, Phone } from "lucide-react";
import { StudioInfo } from "../page";

type BasicStudioInfo = Pick<
  StudioInfo,
  | "name"
  | "logo"
  | "district"
  | "contact"
  | "rating"
  | "number_of_review"
  | "number_of_completed_booking"
>;

interface Props {
  basicInfo: BasicStudioInfo;
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
    <section className="flex justify-between gap-x-2 mt-5">
      <div className="flex justify-center items-center gap-4 flex-wrap">
        <StudioLogo logo={logo} size="md" />
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
            {/* Contact */}
            <div className="flex items-center">
              <Phone
                size={14}
                className="me-1"
                fill="#01a2c7"
                strokeWidth={0}
              />
              <p className="text-sm me-2">{contact}</p>
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
