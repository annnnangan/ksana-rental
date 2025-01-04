import React from "react";
import StudioCard from "./_component/StudioCard";
import Search from "./_component/Search";
import StudioList from "./_component/StudioList";

export interface StudioQuery {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
}

const ExploreStudiosPage = () => {
  return (
    <>
      <Search />
      <StudioList />
    </>
  );
};

export default ExploreStudiosPage;
