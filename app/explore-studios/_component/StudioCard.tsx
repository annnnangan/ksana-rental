import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const StudioCard = () => {
  return (
    <Link
      href="/explore-studios"
      className="group px-3 pb-10 w-full md:1/2 lg:w-1/3 xl:w-1/4"
    >
      <div>
        <div className="relative rounded-md overflow-hidden shadow">
          {/* Cover Image */}
          <div className="aspect-[3/1] bg-neutral-200 mb-1 overflow-hidden">
            <Image
              alt="studio cover image"
              width={500}
              height={500}
              src="https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/1d43d4ec82137555a5666ace24b450b66281e05b213a7ee644f99adae233d800.jpg"
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
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src="https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/2cfc5b64278a5159f2bcf811f64526d63e97084df6f58bb56f6a7793a56fdcb8.png"
                    className="object-cover"
                  />
                </Avatar>
              </div>
            </div>

            <h3 className="text-sm font-bold">Soul Yogi Studio</h3>
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
                <p className="text-sm">元朗, 新界</p>
              </div>
              {/* Rate */}
              <div className="flex items-center">
                <Star
                  size={14}
                  className="me-1"
                  fill="#01a2c7"
                  strokeWidth={0}
                />
                <p className="text-sm me-2">5.0(9)</p>
                <p className="h-1 w-1 rounded-full bg-gray-400"></p>
                <p className="text-sm ms-2">20人已預約</p>
              </div>
            </div>

            <p>HK$100 起</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudioCard;
