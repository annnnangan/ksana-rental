import React from "react";
import AvatarWithFallback from "@/app/_components/AvatarWithFallback";
import { StudioInfo } from "./page";

interface Props {
  studioInfo: StudioInfo;
}

const StudioBasicInfo = ({ studioInfo }: Props) => {
  return (
    <div className="flex gap-5 mb-10">
      <AvatarWithFallback
        avatarUrl={studioInfo.studio_logo}
        type={"studio"}
        size="lg"
      />

      <div>
        <p>
          <span className="font-bold">Studio: </span>
          {studioInfo.studio_name}
        </p>
        <p>
          <span className="font-bold">Contact: </span>
          {studioInfo.studio_contact}
        </p>
        <p>
          <span className="font-bold">Email: </span>
          {studioInfo.studio_email}
        </p>
      </div>
    </div>
  );
};

export default StudioBasicInfo;
