import React, { PropsWithChildren } from "react";
import { Text } from "@radix-ui/themes";

const SectionTitle = ({ children }: PropsWithChildren) => {
  return (
    <Text size="4" weight="bold" color="blue">
      {children}
    </Text>
  );
};

export default SectionTitle;
