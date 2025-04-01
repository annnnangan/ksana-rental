import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1 className="text-primary text-2xl font-bold mb-5">所有場地</h1>
      {children}
    </>
  );
};

export default layout;
