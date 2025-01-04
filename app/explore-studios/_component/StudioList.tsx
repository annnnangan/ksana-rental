import React from "react";
import StudioCard from "./StudioCard";

const StudioList = () => {
  return (
    <div className="flex flex-wrap -mx-3">
      <StudioCard />
      <StudioCard />
      <StudioCard />
      <StudioCard />
      <StudioCard />
    </div>
  );
};

export default StudioList;
