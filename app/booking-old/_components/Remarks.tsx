"use client";
import { Flex, TextArea } from "@radix-ui/themes";
import React, { useState } from "react";
import SectionTitle from "./SectionTitle";
import useBookingStore from "@/stores/BookingStore";

interface Props {
  remarks?: string;
}

const Remarks = ({ remarks }: Props) => {
  const { setRemarks } = useBookingStore();
  const [userInput, setUserInput] = useState<string | undefined>(remarks);
  return (
    <Flex direction="column" gap="2" maxWidth={{ sm: "100%", lg: "500px" }}>
      <SectionTitle>備註</SectionTitle>
      <TextArea
        size="2"
        value={userInput || ""}
        placeholder="留下備註給場地..."
        onChange={(e) => {
          const value = e.target.value;
          setUserInput(value);
          setRemarks(value);
        }}
      />
    </Flex>
  );
};

export default Remarks;
