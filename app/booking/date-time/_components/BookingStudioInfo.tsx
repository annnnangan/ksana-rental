import React from "react";

import { bookingService } from "@/services/BookingService";
import { BookingQuery } from "../page";
import { Avatar, Flex } from "@radix-ui/themes";
import SectionTitle from "../../_components/SectionTitle";

interface Props {
  searchParams: BookingQuery;
}

const BookingStudioInfo = async ({ searchParams }: Props) => {
  const studioSlug = searchParams.studio;

  const studioInfo = await bookingService.getStudioNameAddress(studioSlug);

  return (
    <Flex direction="column" gap="2">
      <SectionTitle>租用場地</SectionTitle>
      <Flex gap="4">
        <Avatar
          radius="full"
          fallback={
            studioInfo.data![0].name ? studioInfo.data![0].name[0] : "A"
          }
        />
        <Flex direction="column">
          <p className="font-bold">
            {studioInfo.success ? studioInfo.data![0].name : ""}
          </p>
          <p>{studioInfo.success ? studioInfo.data![0].address : ""}</p>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default BookingStudioInfo;
