import Section from "../Section";
import SocialMediaBadge from "./SocialMediaBadge";

interface Props {
  socialMediaList: {
    type: string;
    contact: string;
  };
}

const SocialMediaSection = ({ socialMediaList }: Props) => {
  return (
    <Section title={"社交媒體"}>
      <div className="flex gap-x-8 gap-y-4 flex-wrap">
        {Object.entries(socialMediaList).map(([key, value]) => (
          <SocialMediaBadge key={key} type={key} value={value} />
        ))}
      </div>
    </Section>
  );
};

export default SocialMediaSection;
