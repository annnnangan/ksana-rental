import { Flex, Radio, Text } from "@radix-ui/themes";
import React from "react";
import SectionTitle from "./SectionTitle";

interface Props {
  price: number;
  isAlignRight: boolean;
  isLargeTextSize: boolean;
}

const Price = ({ price, isAlignRight, isLargeTextSize }: Props) => {
  return (
    <div className={isAlignRight ? "ms-auto" : ""}>
      <div className={isAlignRight ? "text-end" : ""}>
        <SectionTitle>價錢</SectionTitle>
      </div>
      <p className={isLargeTextSize ? "text-2xl" : ""}>
        HK$ {price == 0 ? "---" : price}
      </p>
    </div>
  );
};

export default Price;
