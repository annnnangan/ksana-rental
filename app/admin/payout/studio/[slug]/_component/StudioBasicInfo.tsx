import AvatarWithFallback from "@/components/custom-components/AvatarWithFallback";
import { StudioPayoutOverviewData } from "../page";

interface Props {
  studioInfo: StudioPayoutOverviewData;
}

const StudioBasicInfo = ({
  studioInfo: { studio_logo, studio_name, studio_email, studio_contact },
}: Props) => {
  return (
    <div className="flex gap-5 mb-10">
      <AvatarWithFallback avatarUrl={studio_logo} type={"studio"} size="lg" />

      <div>
        <p>
          <span className="font-bold">Studio: </span>
          {studio_name}
        </p>
        <p>
          <span className="font-bold">Contact: </span>
          {studio_contact}
        </p>
        <p>
          <span className="font-bold">Email: </span>
          {studio_email}
        </p>
      </div>
    </div>
  );
};

export default StudioBasicInfo;
