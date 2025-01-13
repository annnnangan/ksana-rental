import React from "react";
import Image from "next/image";

const socialMediaMap = {
  instagram: { icon: "/social/instagram.svg", label: "Instagram" },
  website: { icon: "/social/website.svg", label: "Website" },
  facebook: { icon: "/social/facebook.svg", label: "Facebook" },
  youtube: { icon: "/social/youtube.svg", label: "YouTube" },
};

interface Props {
  socialMediaItem: {
    type: string;
    contact: string;
  };
}

const SocialMediaBadge = ({ socialMediaItem }: Props) => {
  const { type, contact } = socialMediaItem;
  const socialMedia = socialMediaMap[type as keyof typeof socialMediaMap];

  return (
    <a href={contact} target="_blank" rel="noopener noreferrer">
      <div className="flex items-center gap-2 group">
        <div className="rounded-full bg-brand-50 p-3 w-fit group-hover:bg-brand-100 transition duration-300">
          <Image
            src={socialMedia.icon}
            alt={`${socialMedia.label} Icon`}
            width={20}
            height={20}
          />
        </div>
        <p className="group-hover:text-primary transition duration-300">
          {socialMedia.label}
        </p>
      </div>
    </a>
  );
};

export default SocialMediaBadge;
