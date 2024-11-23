import React from "react";
import StepTitle from "../_components/StepTitle";
import { bookingService } from "@/services/BookingService";
import { redirect } from "next/navigation";

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
  //todo - call database to get booking info
  //studio name, studio address, booking date and time, price, remarks, phone
  const studioInfoResult = await bookingService.getBookingInfo(
    bookingReferenceNumber,
    userId
  );

  if (!studioInfoResult.success) {
    redirect("/studio");
  }
  //todo - could revise remarks & phone and update database when hit agree but cannot revise the date, time and price
  return (
    <>
      <StepTitle>確認場地租用資料</StepTitle>
    </>
  );
};

export default BookingSummaryPage;
