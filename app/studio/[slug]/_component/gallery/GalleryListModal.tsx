import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleX } from "lucide-react";
import GalleryImage from "./GalleryImage";

interface Props {
  isOpen: boolean;
  onCloseModal: () => void;
}

const GalleryListModal = ({ isOpen, onCloseModal }: Props) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="w-full max-w-6xl h-auto max-h-[90vh] overflow-hidden rounded-lg p-0">
        <DialogHeader className="sticky top-0 bg-white z-10 border-b p-4">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto p-4">
          <GalleryImage />
          <GalleryImage />
          <GalleryImage />
          <GalleryImage />
          <GalleryImage />
          <GalleryImage />
          <GalleryImage />
          <GalleryImage />
          <GalleryImage />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryListModal;
