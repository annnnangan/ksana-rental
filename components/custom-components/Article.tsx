import Image from "next/image";
import ButtonLink from "./common/buttons/ButtonLink";
import { CircleChevronLeft } from "lucide-react";

const Article = ({
  children,
  title,
  description,
  coverImage,
  updatedDate,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  coverImage: string;
  updatedDate: string;
}) => {
  return (
    <div className="my-5">
      <div className="w-full flex justify-end">
        <ButtonLink variant="ghost" href="/studio-owner/helps">
          <div className="flex gap-2 items-center">
            <CircleChevronLeft />
            Back
          </div>
        </ButtonLink>
      </div>

      <div className="relative aspect-[7/1] bg-neutral-200 mb-1 overflow-hidden">
        <Image
          alt={`article image`}
          sizes="w-full"
          fill
          src={coverImage}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <h1 className="font-bold text-3xl mt-2">{title}</h1>
      <p className="text-xs text-gray-500 mt-2">最後更新：{updatedDate}</p>
      <div className="mt-8">
        <h2 className="mb-5">{description}</h2>
        {children}
      </div>
    </div>
  );
};

export default Article;
