import ErrorMessage from "@/components/custom-components/ErrorMessage";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { FieldError } from "react-hook-form";

interface Props {
  images: (string | File)[];
  removeImage?: (identifier: string | number, imageSrc: string) => void;
  error?: FieldError[];
  gridCol?: number;
  gridColSpan?: string | undefined;
  imageRatio?: string;
  imageAlt: string;
  allowDeleteImage: boolean;
}

const ImagesGridPreview = ({
  images,
  removeImage,
  error,
  gridCol = 12,
  gridColSpan = "col-span-12 md:col-span-6 lg:col-span-4",
  imageRatio = "aspect-video",
  imageAlt = "image",
  allowDeleteImage,
}: Props) => {
  return (
    <div>
      <div className={`grid grid-cols-${gridCol} gap-2 my-2`}>
        {images.map((image, index) => {
          // Determine `src` based on the type of `image`

          const src =
            typeof image === "string" ? image : URL.createObjectURL(image);

          // Determine unique identifier for removal
          const identifier =
            typeof image === "string" ? image : image.lastModified;

          return (
            <div className={gridColSpan} key={identifier}>
              <div className={`relative ${imageRatio} group`}>
                <Image
                  src={src}
                  alt={imageAlt}
                  className="object-cover transition-all duration-500 group-hover:brightness-50"
                  fill
                  sizes="w-auto"
                />
                {allowDeleteImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="Delete Image"
                      onClick={() =>
                        removeImage && removeImage(identifier, src)
                      }
                    >
                      <div className="rounded-full p-2 bg-brand-600 hover:bg-brand-700 transition-all duration-500">
                        <Trash2 className="w-6 h-6 text-white" />
                      </div>
                    </button>
                  </div>
                )}
              </div>
              {error?.[index]?.message && (
                <ErrorMessage>{error[index]?.message}</ErrorMessage>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagesGridPreview;
