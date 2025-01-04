import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  findAreaByDistrictValue,
  getDistrictLabelByDistrictValue,
} from "@/lib/utils/areas-districts-converter";
import { Bookmark, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { studioCardInfo } from "./StudioList";

interface Props {
  studio: studioCardInfo;
}

const StudioCard = ({ studio }: Props) => {
  return (
    <Link
      href={`/studio/${studio.slug}`}
      className="group px-3 pb-10 w-full md:1/2 lg:w-1/3 xl:w-1/4"
    >
      <div>
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
            <button className="p-2 bg-white rounded-full shadow-md">
              <Bookmark className="text-gray-700" size={14} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex gap-x-2">
            <div>
              <div className="-mt-6 ml-3 mb-1 flex items-end gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={studio.logo} className="object-cover" />
                </Avatar>
              </div>
            </div>

            <h3 className="text-sm font-bold">{studio.name}</h3>
          </div>

          <div className="px-5 py-3">
            <div className="mb-2">
              {/* Location */}
              <div className="flex items-center">
                <MapPin
                  size={14}
                  className="me-1"
                  fill="#01a2c7"
                  strokeWidth={0}
                />
                <p className="text-sm">
                  {getDistrictLabelByDistrictValue(studio.district) +
                    ", " +
                    findAreaByDistrictValue(studio.district)?.label}
                </p>
              </div>
              {/* Rate */}
              <div className="flex items-center">
                <Star
                  size={14}
                  className="me-1"
                  fill="#01a2c7"
                  strokeWidth={0}
                />
                <p className="text-sm me-2">
                  {studio.rating !== null
                    ? (Math.round(studio.rating * 10) / 10).toFixed(1)
                    : "--"}
                  ({studio.number_of_review})
                </p>
                <p className="h-1 w-1 rounded-full bg-gray-400"></p>
                <p className="text-sm ms-2">
                  {studio.number_of_completed_booking}個已完成預約
                </p>
              </div>
            </div>

            <p>HK${studio.min_price} 起</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudioCard;
