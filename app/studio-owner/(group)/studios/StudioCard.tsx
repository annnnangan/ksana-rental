import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, ImageIcon } from "lucide-react";
import React from "react";
import Image from "next/image";
import LinkButton from "@/components/animata/button/link-button";
import StudioStatusBadge from "@/app/_components/StudioStatusBadge";
import { MapPin } from "lucide-react";
import { StudioStatus } from "@/services/model";
import {
  findAreaByDistrictValue,
  getDistrictLabelByDistrictValue,
} from "@/lib/utils/areas-districts-converter";

interface StudioInfo {
  id: string;
  name: string;
  cover_photo: string;
  logo: string;
  status: StudioStatus;
  area: string;
  district: string;
}

interface Props {
  studioInfo: StudioInfo;
}

const StudioCard = ({ studioInfo }: Props) => {
  return (
    <div className="px-3 pb-10 w-full lg:w-1/2 xl:w-1/3">
      <div className=" rounded-md overflow-hidden shadow">
        {/* Cover Image */}
        <div className="relative aspect-[3/1] bg-neutral-200  mb-1">
          {studioInfo.cover_photo ? (
            <Image
              alt="studio cover image"
              src={studioInfo.cover_photo}
              fill={true}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon />
            </div>
          )}
        </div>
        {/* Logo */}
        <div className="flex gap-x-2">
          <div>
            <div className="-mt-6 ml-3 mb-1 flex items-end gap-4">
              <Avatar className="h-12 w-12">
                {studioInfo.logo ? (
                  <AvatarImage src={studioInfo.logo} className="object-cover" />
                ) : (
                  <AvatarFallback>
                    <Building2 size={14} />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>

          <h3 className="text-sm font-bold">{studioInfo.name}</h3>
        </div>

        <div className="p-5">
          <div className="flex gap-x-1">
            <p className="text-sm">場地狀態:</p>
            <StudioStatusBadge status={studioInfo.status} />
          </div>
        </div>
        <div className="flex justify-between px-5 pb-2">
          <div>
            {studioInfo.district && (
              <div className="flex justify-center items-center">
                <MapPin size={14} />
                <p className="text-sm">
                  {getDistrictLabelByDistrictValue(studioInfo.district)},{" "}
                  {findAreaByDistrictValue(studioInfo.district)?.label}
                </p>
              </div>
            )}
          </div>
          <LinkButton
            href={`/studio-owner/studio/${studioInfo.id}/onboarding/basic-info`}
            children={"繼續登記"}
          />
        </div>
      </div>
    </div>
  );
};

export default StudioCard;
