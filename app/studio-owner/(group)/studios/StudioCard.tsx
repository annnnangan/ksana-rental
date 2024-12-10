import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, ImageIcon } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import LinkButton from "@/components/animata/button/link-button";
import StudioStatusBadge from "@/app/_components/StudioStatusBadge";

const StudioCard = () => {
  const coverPreviewUrl =
    "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/2da6e2bc0b9c4bde8241c937e0672f22602607021868eab8b3a5f741c0354d82.png";
  //   const coverPreviewUrl = undefined;
  const logoPreviewUrl =
    "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/bab6afeb7df4f41c260a2e2e6cd0700bb31028df16e741b8c2aeac45090997ae.jpg";
  return (
    <div className="px-3 pb-10 w-full lg:w-1/2 xl:w-1/3">
      <div className=" rounded-md overflow-hidden shadow">
        {/* Cover Image */}
        <div className="relative aspect-[3/1] bg-neutral-200  mb-1">
          {coverPreviewUrl ? (
            <Image
              alt="studio cover image"
              src={coverPreviewUrl}
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
          <div className="-mt-6 ml-3 mb-1 flex items-end gap-4">
            <Avatar className="h-12 w-12">
              {logoPreviewUrl ? (
                <AvatarImage src={logoPreviewUrl} className="object-cover" />
              ) : (
                <AvatarFallback>
                  <Building2 size={14} />
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          <h3 className="text-sm font-bold">Olivia Studio</h3>
        </div>

        <div className="p-5">
          <div className="flex gap-x-1">
            <p className="text-sm">場地狀態:</p>
            <StudioStatusBadge status="draft" />
          </div>
        </div>
        <div className="flex justify-end px-5 pb-2">
          <LinkButton
            href="/studio-owner/studio/1/onboarding/basic-info"
            children={" 繼續登記"}
          />
        </div>
      </div>
    </div>
  );
};

export default StudioCard;
