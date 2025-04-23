"use client";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { CircleX } from "lucide-react";

import AvatarWithFallback from "@/components/custom-components/common/AvatarWithFallback";
import GallerySlideshow from "@/components/custom-components/studio-page/gallery/GallerySlideshow";
import BookNowButtonWrapper from "../../BookNowButtonWrapper";

interface Props {
  isOpen: boolean;
  onCloseModal: () => void;
  images: string[];
  userProfile: { icon: string; name: string };
}

const ReviewImageModal = ({ isOpen, onCloseModal, images, userProfile }: Props) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="flex flex-col w-full max-w-6xl h-[90vh] overflow-hidden rounded-lg p-4">
        <DialogHeader className="sticky top-0 bg-white z-10 border-b pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-2">
              <DialogTitle>
                <div className="flex gap-3 items-center">
                  <AvatarWithFallback size="xs" avatarUrl={userProfile.icon} type={"user"} />
                  <div>
                    <p className="font-bold text-md">{userProfile.name}</p>
                  </div>
                </div>
              </DialogTitle>
            </div>

            <div className="flex items-center gap-x-2">
              <BookNowButtonWrapper />
              <Button type="button" variant="ghost" onClick={onCloseModal}>
                <CircleX />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <GallerySlideshow images={images} />
      </DialogContent>
    </Dialog>
  );
};

export default ReviewImageModal;
