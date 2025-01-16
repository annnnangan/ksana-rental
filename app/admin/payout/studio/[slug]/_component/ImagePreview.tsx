import React from "react";
import Image from "next/image"; // Ensure you are importing the Image component from Next.js
import { Trash2 } from "lucide-react";

interface Props {
  images: string[];
  onImageRemove?: (imageToDelete: string) => void;
  isExistingImage: boolean;
}

const ImagePreview = ({
  images,
  onImageRemove,
  isExistingImage = false,
}: Props) => {
  return (
    <div className="grid grid-cols-3 mt-5">
      {images.map((image) => (
        <div key={image} className="relative aspect-[3/4] group">
          <Image
            src={image}
            alt="proof image"
            className="object-contain transition-all duration-500 group-hover:brightness-50"
            fill
            sizes="w-auto"
          />
          {!isExistingImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Delete Image"
              >
                <div className="rounded-full p-2 bg-brand-600 hover:bg-brand-700 transition-all duration-500">
                  <Trash2
                    className="w-6 h-6 text-white"
                    onClick={() => onImageRemove?.(image)}
                  />
                </div>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
