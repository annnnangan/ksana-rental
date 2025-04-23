"use client";
import StudioImage from "@/components/custom-components/studio-card/StudioImage";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { CircleX, GalleryThumbnails } from "lucide-react";
import React from "react";

interface Props {
  isOpenListModal: boolean;
  onCloseListModal: () => void;
  openSlideshowModal: () => void;
  images: string[];
  children: React.ReactNode;
}

const GalleryListModal = ({
  isOpenListModal,
  onCloseListModal,
  openSlideshowModal,
  images,
  children,
}: Props) => {
  return (
    <>
      <Dialog open={isOpenListModal}>
        <DialogContent className="w-full max-w-6xl h-auto max-h-[90vh] overflow-hidden rounded-lg p-0">
          <DialogHeader className="sticky top-0 bg-white z-10 border-b p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-2">
                <DialogTitle>所有圖片</DialogTitle>
                <Button variant="outline" className="rounded-full" onClick={openSlideshowModal}>
                  <GalleryThumbnails />
                  <span className="hidden md:inline">Slideshow</span>
                </Button>
              </div>

              <div className="flex items-center gap-x-2">
                {children}
                <Button type="button" variant="ghost" onClick={onCloseListModal}>
                  <CircleX />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto p-4">
            {images.map((image) => (
              <StudioImage onClick={openSlideshowModal} imageUrl={image} key={image} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryListModal;
