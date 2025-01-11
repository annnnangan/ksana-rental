import Image from "next/image";
import Section from "../Section";
import SocialMediaBadge from "../SocialMediaBadge";

const socialMediaMap = {
  instagram: { icon: "/social/instagram.svg", label: "Instagram" }, // Replace with Instagram path
  website: { icon: "/social/website.svg", label: "Website" },
  facebook: { icon: "/social/facebook.svg", label: "Facebook" },
  youtube: { icon: "/social/youtube.svg", label: "YouTube" }, // Replace with YouTube path
};

interface Props {
  socialMediaList: {
    type: string;
    contact: string;
  }[];
}

const SocialMediaSection = ({ socialMediaList }: Props) => {
  return (
    <Section title={"社交媒體"}>
      <div className="flex gap-8 flex-wrap">
        {socialMediaList.map((item) => (
          <SocialMediaBadge socialMediaItem={item} key={item.type} />
        ))}
      </div>
    </Section>
  );
};

export default SocialMediaSection;
