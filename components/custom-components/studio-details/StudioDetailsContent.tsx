"use client";

import BasicInfoForm2 from "./BasicInfoForm2";

interface Props {
  activeTab: string;
  studioId: string;
}

const StudioDetailsContent = ({ activeTab, studioId }: Props) => {
  return (
    <div className="mt-5">
      {activeTab === "basic-info" && (
        <BasicInfoForm2 studioId={studioId} isOnboardingStep={true} defaultValues={{ logo: "", cover_photo: "", name: "", slug: "1234", description: "", address: "", district: "" }} />
      )}
    </div>
  );
};

export default StudioDetailsContent;
