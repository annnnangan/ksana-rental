"use client";
import { Flex, Strong, TextField, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import useBookingStore from "@/stores/BookingStore";

interface Props {
  whatsapp?: string;
}

const Whatsapp = ({ whatsapp }: Props) => {
  const { setWhatsapp } = useBookingStore();
  const [userInput, setUserInput] = useState<string | undefined>(
    whatsapp ? whatsapp.slice(4) : undefined
  );
  useEffect(() => {
    whatsapp ? setWhatsapp(whatsapp) : null;
  }, []);

  return (
    <Flex direction="column" gap="2" maxWidth={{ sm: "100%", lg: "500px" }}>
      <SectionTitle>Whatsapp</SectionTitle>

      <TextField.Root
        placeholder="請留下你的Whatsapp方便聯絡"
        value={userInput || ""}
        type="tel"
        onChange={(e) => {
          const value = e.target.value;
          setUserInput(value);
          setWhatsapp("+852" + value);
        }}
      >
        <TextField.Slot>
          <Text color="sky">
            <Strong>+852</Strong>
          </Text>
        </TextField.Slot>
      </TextField.Root>
    </Flex>
  );
};

export default Whatsapp;
