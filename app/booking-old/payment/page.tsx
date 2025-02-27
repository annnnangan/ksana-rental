import { bookingService } from "@/services/BookingService";
import StripeWrapper from "./_components/StripeWrapper";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";

interface BookingQuery {
  booking: string;
}

interface Props {
  searchParams: Promise<BookingQuery>;
}

const BookingPaymentPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const bookingReferenceNumber = searchParams.booking;
  const userId = 2;
  //Get the price based on the booking query string

  let price;

  try {
    const bookingInfoResult = await bookingService.getBookingInfo(
      bookingReferenceNumber,
      userId
    );
    price = bookingInfoResult.data.price;
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

  return (
    <StripeWrapper
      price={price}
      bookingReferenceNumber={bookingReferenceNumber}
    />
  );
};

export default BookingPaymentPage;
