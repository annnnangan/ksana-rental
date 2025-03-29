import { studioCardInfo } from "@/app/(user)/explore-studios/page";
import StudioLocation from "@/components/custom-components/studio/StudioLocation";
import StudioLogo from "@/components/custom-components/studio/StudioLogo";
import StudioRating from "@/components/custom-components/studio/StudioRating";
import Image from "next/image";
import Link from "next/link";
import BookmarkButton from "../studio-page/BookmarkButton";

interface Props {
  studio: studioCardInfo;
  bookmarkRouterRefresh: boolean;
}

const StudioCard = ({ studio, bookmarkRouterRefresh = false }: Props) => {
  return (
    <div>
      <Link href={`/studio/${studio.slug}`} className="group px-3 pb-10 w-full md:1/2 lg:w-1/3 xl:w-1/4">
        <div className="relative rounded-md overflow-hidden shadow">
          {/* Cover Image */}
          <div className="aspect-[3/1] bg-neutral-200 mb-1 overflow-hidden">
            <Image
              alt={`${studio.name} cover image`}
              width={500}
              height={500}
              src={studio.cover_photo}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Bookmark Icon */}
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <BookmarkButton studioSlug={studio.slug} needRouterRefresh={bookmarkRouterRefresh} />
          </div>

          {/* Logo */}
          <div className="flex gap-x-2">
            <div>
              <div className="-mt-6 ml-3 mb-1 flex items-end gap-4">
                <StudioLogo logo={studio.logo} />
              </div>
            </div>

            <h3 className="text-sm font-bold">{studio.name}</h3>
          </div>

          <div className="px-5 py-3">
            <div className="mb-2">
              {/* Location */}
              <StudioLocation district={studio.district} />
              {/* Rate */}
              <StudioRating rating={studio.rating} numberOfReview={studio.number_of_review} numberOfCompletedBooking={studio.number_of_completed_booking} />
            </div>

            <p>HK${studio.min_price} 起</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StudioCard;
