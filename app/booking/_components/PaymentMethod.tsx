import React from "react";
import SectionTitle from "./SectionTitle";
import { Flex, Radio, Text } from "@radix-ui/themes";

const PaymentMethod = () => {
  return (
    <Flex direction="column">
      <SectionTitle>付款方式</SectionTitle>
      <Flex asChild gap="2">
        <Text as="label" size="3">
          <Radio size="2" name="payment" value="credit-card" defaultChecked />
          信用卡
        </Text>
      </Flex>
    </Flex>
  );
};

export default PaymentMethod;
