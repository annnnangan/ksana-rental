"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleX } from "lucide-react";
import GallerySlideshow from "./GallerySlideshow";

interface Props {
  isOpen: boolean;
  onCloseModal: () => void;
}

const GallerySlideshowModal = ({ isOpen, onCloseModal }: Props) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="flex flex-col w-full max-w-6xl h-[90vh] overflow-hidden rounded-lg p-4">
        <DialogHeader className="sticky top-0 bg-white z-10 border-b pb-4">
          <div className="flex justify-between items-center">
            <DialogTitle>所有圖片</DialogTitle>

            <div className="flex items-center gap-x-2">
              <Button type="button">立即預約</Button>
              <Button type="button" variant="ghost" onClick={onCloseModal}>
                <CircleX />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <GallerySlideshow />
      </DialogContent>
    </Dialog>
  );
};

export default GallerySlideshowModal;
