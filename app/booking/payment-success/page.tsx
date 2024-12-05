import { bookingService } from "@/services/BookingService";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout, Flex, Text } from "@radix-ui/themes";
import DateTimeInfo from "../_components/DateTimeInfo";
import SectionTitle from "../_components/SectionTitle";
import StepTitle from "../_components/StepTitle";
import StudioNameAddress from "../_components/StudioNameAddress";
import okIcon from "@/public/assets/ok.png";
import Image from "next/image";
import ActionButtons from "./ActionButtons";
import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";

//ensure the booking status is confirm
//get the booking id
//call database to get booking info
//show data on screen

interface BookingQuery {
  booking: string;
}

interface Props {
  searchParams: Promise<BookingQuery>;
}

const PaymentSuccessPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const bookingReferenceNumber = searchParams.booking;
  const userId = 2;
  let bookingInfo;

  //Get Booking Info
  try {
    const result = await bookingService.getConfirmBookingInfo(
      bookingReferenceNumber,
      2
    );
    if (result && result.success) {
      bookingInfo = result.data;
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "系統出現錯誤。";
    return (
      <ToastMessageWithRedirect
        type={"error"}
        errorMessage={errorMessage}
        redirectPath={"/studio"}
      />
    );
  }

  return (
    <>
      <Flex
        align="center"
        justify="center"
        direction="column"
        style={{ marginTop: "50px" }}
        gap="4"
      >
        <Image src={okIcon} width="80" height="80" alt="okay icon" />
        <StepTitle>感謝你的預約</StepTitle>
        <Flex gap="4" direction="column" align="center">
          <SectionTitle>已成功為你預約以下場地及時間</SectionTitle>

          <Flex direction="column" gap="2" align="center">
            <SectionTitle>預約編號</SectionTitle>
            <Text>{bookingReferenceNumber}</Text>
          </Flex>

          <StudioNameAddress
            studioName={bookingInfo.name}
            studioAddress={bookingInfo.address}
            alignValue={"center"}
          />

          <DateTimeInfo
            bookingDate={bookingInfo.date}
            startTime={bookingInfo.start_time}
            endTime={bookingInfo.end_time}
            alignValue={"center"}
          />

          <Callout.Root>
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              你可於預約前2小時，到我的預約頁面中查看場地密碼。
            </Callout.Text>
          </Callout.Root>
        </Flex>

        <ActionButtons studioSlug={bookingInfo.slug} />
      </Flex>
    </>
  );
};

export default PaymentSuccessPage;
