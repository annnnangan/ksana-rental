"use client";
import { TextArea, Text, Flex, TextField, Strong } from "@radix-ui/themes";
import React from "react";
import SectionTitle from "../../_components/SectionTitle";
import useBookingStore from "@/stores/BookingStore";

const BookingInput = () => {
  const { setRemarks, setWhatsapp } = useBookingStore();
  return (
    <>
      <Flex direction="column" gap="2" maxWidth={{ sm: "100%", lg: "500px" }}>
        <SectionTitle>Whatsapp</SectionTitle>

        <TextField.Root
          placeholder="請留下你的Whatsapp方便聯絡"
          type="tel"
          onChange={(e) => {
            setWhatsapp("+852" + e.target.value);
          }}
        >
          <TextField.Slot>
            <Text color="sky">
              <Strong>+852</Strong>
            </Text>
          </TextField.Slot>
        </TextField.Root>
      </Flex>
      <Flex direction="column" gap="2" maxWidth={{ sm: "100%", lg: "500px" }}>
        <SectionTitle>備註</SectionTitle>
        <TextArea
          size="2"
          placeholder="留下備註給商戶..."
          onChange={(e) => {
            setRemarks(e.target.value);
          }}
        />
      </Flex>
    </>
  );
};

export default BookingInput;
