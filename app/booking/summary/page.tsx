import React from "react";
import StepTitle from "../_components/StepTitle";
import { bookingService } from "@/services/BookingService";
import { redirect } from "next/navigation";
import SectionTitle from "../_components/SectionTitle";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import DateTimeInfo from "../_components/DateTimeInfo";
import StudioNameAddress from "../_components/StudioNameAddress";
import Price from "../_components/Price";
import PaymentMethod from "../_components/PaymentMethod";
import Whatsapp from "../_components/Whatsapp";
import Remarks from "../_components/Remarks";
import HandleSubmission from "./HandleSubmission";
import ToastMessage from "@/app/_components/ToastMessageWithRedirect";
import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";

interface BookingQuery {
  booking: string;
}

interface Props {
  searchParams: Promise<BookingQuery>;
}

const BookingSummaryPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const bookingReferenceNumber = searchParams.booking;
  const userId = 2;
  let bookingInfo;
  //todo - call database to get booking info
  //studio name, studio address, booking date and time, price, remarks, phone
  try {
    const bookingInfoResult = await bookingService.getBookingInfo(
      bookingReferenceNumber,
      userId
    );
    bookingInfo = bookingInfoResult.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "系統出現錯誤，請重試。";
    return (
      <ToastMessageWithRedirect
        type={"error"}
        errorMessage={errorMessage}
        redirectPath={"/studio"}
      />
    );
  }

  //todo - could revise remarks & phone and update database when hit agree but cannot revise the date, time and price
  return (
    <>
      <StepTitle>確認場地租用資料</StepTitle>
      <Flex direction="column" gap="6">
        <StudioNameAddress
          studioName={bookingInfo.name}
          studioAddress={bookingInfo.address}
          alignValue={"start"}
        />
        <DateTimeInfo
          startTime={bookingInfo.start_time}
          bookingDate={bookingInfo.date}
          endTime={bookingInfo.end_time}
          alignValue={"start"}
        />
        <PaymentMethod />
        <Price
          price={bookingInfo.price}
          isAlignRight={false}
          isLargeTextSize={false}
        />
        <Whatsapp whatsapp={bookingInfo.whatsapp} />
        <Remarks remarks={bookingInfo.remarks} />
        <HandleSubmission />
      </Flex>
    </>
  );
};

export default BookingSummaryPage;
