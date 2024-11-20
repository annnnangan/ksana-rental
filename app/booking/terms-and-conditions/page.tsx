import { bookingService } from "@/services/BookingService";
import {
  Box,
  Checkbox,
  Flex,
  Heading,
  ScrollArea,
  Text,
} from "@radix-ui/themes";
import { redirect } from "next/navigation";
import React from "react";
import HandleSubmission from "./_components/HandleSubmission";

interface BookingQuery {
  booking: string;
}

interface Props {
  searchParams: Promise<BookingQuery>;
}

const BookingTermsNConditionsPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const bookingReferenceNumber = searchParams.booking;
  const userId = 2;
  //Get booking status based on booking reference number on search query
  //If status is not pending for payment, user will be redirect back to studio page
  try {
    const bookingStatus = await bookingService.getBookingStatus(
      bookingReferenceNumber,
      userId
    );

    if (!bookingStatus.success) {
      redirect("/studio");
    }
    if (bookingStatus.success) {
      if (bookingStatus.data !== "pending for payment") {
        redirect("/studio");
      }
    }
  } catch (error) {
    redirect("/studio");
  }

  return (
    <>
      <Box pb="5">
        <Text size="7" weight="bold" color="blue">
          條款與細則
        </Text>
      </Box>
      <Box pb="6">
        <ScrollArea type="always" scrollbars="vertical" style={{ height: 200 }}>
          <Box p="2" pr="8">
            <Heading size="4" mb="2" trim="start">
              Principles of the typographic craft
            </Heading>
            <Flex direction="column" gap="4">
              <Text as="p">
                Three fundamental aspects of typography are legibility,
                readability, and aesthetics. Although in a non-technical sense
                “legible” and “readable” are often used synonymously,
                typographically they are separate but related concepts.
              </Text>

              <Text as="p">
                Legibility describes how easily individual characters can be
                distinguished from one another. It is described by Walter Tracy
                as “the quality of being decipherable and recognisable”. For
                instance, if a “b” and an “h”, or a “3” and an “8”, are
                difficult to distinguish at small sizes, this is a problem of
                legibility.
              </Text>

              <Text as="p">
                Typographers are concerned with legibility insofar as it is
                their job to select the correct font to use. Brush Script is an
                example of a font containing many characters that might be
                difficult to distinguish. The selection of cases influences the
                legibility of typography because using only uppercase letters
                (all-caps) reduces legibility.
              </Text>
            </Flex>
          </Box>
        </ScrollArea>
      </Box>
      <Box pb="6">
        <ScrollArea type="always" scrollbars="vertical" style={{ height: 200 }}>
          <Box p="2" pr="8">
            <Heading size="4" mb="2" trim="start">
              Principles of the typographic craft
            </Heading>
            <Flex direction="column" gap="4">
              <Text as="p">
                Three fundamental aspects of typography are legibility,
                readability, and aesthetics. Although in a non-technical sense
                “legible” and “readable” are often used synonymously,
                typographically they are separate but related concepts.
              </Text>

              <Text as="p">
                Legibility describes how easily individual characters can be
                distinguished from one another. It is described by Walter Tracy
                as “the quality of being decipherable and recognisable”. For
                instance, if a “b” and an “h”, or a “3” and an “8”, are
                difficult to distinguish at small sizes, this is a problem of
                legibility.
              </Text>

              <Text as="p">
                Typographers are concerned with legibility insofar as it is
                their job to select the correct font to use. Brush Script is an
                example of a font containing many characters that might be
                difficult to distinguish. The selection of cases influences the
                legibility of typography because using only uppercase letters
                (all-caps) reduces legibility.
              </Text>
            </Flex>
          </Box>
        </ScrollArea>
      </Box>
      <HandleSubmission />
    </>
  );
};

export default BookingTermsNConditionsPage;
