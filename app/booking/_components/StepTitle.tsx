import { Box, Text } from "@radix-ui/themes";
import React, { PropsWithChildren } from "react";

const StepTitle = ({ children }: PropsWithChildren) => {
  if (!children) return null;
  return (
    <Box pb="5">
      <Text size="7" weight="bold" color="blue">
        {children}
      </Text>
    </Box>
  );
};

export default StepTitle;
