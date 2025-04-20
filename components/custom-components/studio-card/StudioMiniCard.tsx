import { Card } from "@/components/shadcn/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StudioLocation from "./StudioLocation";

interface Props {
  studio_name: string;
  studio_slug: string;
  cover_image: string;
  rating: string;
  district: string;
}

const StudioMiniCard = ({ studio_name, studio_slug, cover_image, rating, district }: Props) => {
  return (
    <Link href={`/studio/${studio_slug}`}>
      <Card className="flex rounded-md border-0 h-20 gap-2 p-1 bg-gray-100">
        <div className="w-1/3 relative aspect-[1/3] rounded-md overflow-hidden">
          <Image
            src={cover_image}
            alt="cover image"
            className="w-full h-full object-cover object-center"
            fill
            sizes="(min-width: 1540px) 724px, (min-width: 1280px) 596px, (min-width: 1040px) 468px, (min-width: 780px) 340px, 276px"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center">
            <Star size={10} className="me-1" fill="#01a2c7" strokeWidth={0} />
            <p className="text-[10px]">
              {rating !== null ? (Math.round(Number(rating) * 10) / 10).toFixed(1) : "--"}
            </p>
          </div>

          <StudioLocation district={district} iconSize={10} textSize="text-[10px]" />

          <p className="text-[11px] font-bold mt-auto">{studio_name}</p>
        </div>
      </Card>
    </Link>
  );
};

export default StudioMiniCard;
