import SectionTitle from "@/components/custom-components/common/SectionTitle";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SectionTitle textColor="text-primary">所有場地</SectionTitle>
      {children}
    </>
  );
};

export default layout;
