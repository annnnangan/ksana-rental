import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="container p-4 md:p-10">{children}</div>;
};

export default layout;
