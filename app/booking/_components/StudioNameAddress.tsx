import { Avatar, Flex } from "@radix-ui/themes";
import React from "react";
import SectionTitle from "./SectionTitle";

interface Props {
  studioName: string;
  studioAddress: string;
  alignValue: "start" | "end" | "center";
}

const StudioNameAddress = ({
  studioName,
  studioAddress,
  alignValue = "start",
}: Props) => {
  return (
    <Flex direction="column" gap="2" align={alignValue}>
      <SectionTitle>租用場地</SectionTitle>
      <Flex gap="4" align="center">
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
