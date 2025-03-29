import React from "react";
import Image, { StaticImageData } from "next/image";
import LinkButton from "@/components/animata/button/link-button";

interface Props {
  image: StaticImageData;
  title: string;
  href: string;
}

const ArticleCard = ({ image, title, href }: Props) => {
  return (
    <li className="p-3 lg:w-1/3 flex flex-col justify-between">
      <h4 className="font-semibold">{title}</h4>

      <LinkButton href={href} children={"Read"} />

      <Image
        src={image}
        alt="yoga banner image"
        sizes="(min-width: 1024px) 200px, 100vw"
        className="rounded-md object-cover object-center h-32"
      />
    </li>
  );
};

export default ArticleCard;
