import React, { PropsWithChildren } from "react";

const StepTitle = ({ children }: PropsWithChildren) => {
  return <h1 className="text-2xl text-primary font-bold mb-1"> {children}</h1>;
};

export default StepTitle;
