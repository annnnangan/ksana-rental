"use client";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { CircleX, Grid2x2 } from "lucide-react";
import BookNowButtonWrapper from "../BookNowButtonWrapper";
import GallerySlideshow from "./GallerySlideshow";

interface Props {
  isOpen: boolean;
  onCloseModal: () => void;
  openListModal: () => void;
  images: string[];
}

const GallerySlideshowModal = ({ isOpen, onCloseModal, openListModal, images }: Props) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="flex flex-col w-full max-w-6xl h-[90vh] overflow-hidden rounded-lg p-4">
        <DialogHeader className="sticky top-0 bg-white z-10 border-b pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-2">
              <DialogTitle>所有圖片</DialogTitle>
              <Button variant="outline" className="rounded-full" onClick={openListModal}>
                <Grid2x2 /> <span className="hidden md:inline">Gallery</span>
              </Button>
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

export default GallerySlideshowModal;
