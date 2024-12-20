import React, { useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface Props {
  images: File[];
  removeImage: (imageIndex: number) => void;
}

const ImagePreview = ({ images, removeImage }: Props) => {
  return (
    <div>
      <div className="grid grid-cols-12 gap-2 my-2">
        {images.map((image, index) => {
          const src = URL.createObjectURL(image);
          return (
            <div
              className="relative aspect-video col-span-12 md:col-span-6 lg:col-span-4 group"
              key={src}
            >
              <Image
                src={src}
                alt={image.name}
                className="object-cover transition-all duration-500 group-hover:brightness-50"
                fill
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Delete Image"
                  onClick={() => removeImage(index)}
                >
                  <div className="rounded-full p-2 bg-brand-600 hover:bg-brand-700 transition-all duration-500">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagePreview;
