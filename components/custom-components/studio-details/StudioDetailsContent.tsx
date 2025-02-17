"use client";

import React from "react";
import BasicInfoForm2 from "./BasicInfoForm2";
import { ManageStudioBasicInfoSchema } from "@/lib/validations/zod-schema/studio/studio-manage-schema";
import { saveManageBasicInfo } from "@/actions/studio";
import { OnboardingBasicInfoSchema } from "@/lib/validations/zod-schema/studio/studio-onboarding-schema";

interface Props {
  activeTab: string;
  studioId: string;
}

const StudioDetailsContent = ({ activeTab, studioId }: Props) => {
  return (
    <div className="mt-5">
      {activeTab === "basic-info" && (
        <BasicInfoForm2
          schema={OnboardingBasicInfoSchema}
          studioId={studioId}
          isOnboardingStep={true}
          defaultValues={{ logo: "", cover: "", name: "", slug: "", description: "", address: "", district: "" }}
          onSubmit={saveManageBasicInfo}
        />
      )}
    </div>
  );
};

export default StudioDetailsContent;
