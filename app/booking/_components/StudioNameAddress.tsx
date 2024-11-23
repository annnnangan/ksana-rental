import { Avatar, Flex } from "@radix-ui/themes";
import React from "react";
import SectionTitle from "./SectionTitle";

interface Props {
  studioName: string;
  studioAddress: string;
}

const StudioNameAddress = ({ studioName, studioAddress }: Props) => {
  return (
    <Flex direction="column" gap="2">
      <SectionTitle>租用場地</SectionTitle>
      <Flex gap="4">
        <Avatar radius="full" fallback={studioName ? studioName[0] : "A"} />
        <Flex direction="column">
          <p className="font-bold">{studioName ? studioName : ""}</p>
          <p>{studioAddress ? studioAddress : ""}</p>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StudioNameAddress;
