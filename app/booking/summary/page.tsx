import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { bookingService } from "@/services/BookingService";
import { Flex } from "@radix-ui/themes";
import DateTimeInfo from "../_components/DateTimeInfo";
import PaymentMethod from "../_components/PaymentMethod";
import Price from "../_components/Price";
import Remarks from "../_components/Remarks";
import StepTitle from "../_components/StepTitle";
import StudioNameAddress from "../_components/StudioNameAddress";
import Whatsapp from "../_components/Whatsapp";
import HandleSubmission from "./HandleSubmission";

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
        message={errorMessage}
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
