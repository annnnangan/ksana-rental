import { PriceType } from "@/services/model";
import { Box, Container, Flex } from "@radix-ui/themes";
import "react-day-picker/style.css";
import BookingInfo from "./_components/BookingInfo";
import Calendar from "./_components/Calendar";
import GenerateTimeslot from "./_components/GenerateTimeslot";
import { redirect } from "next/navigation";
import { bookingService } from "@/services/BookingService";

export interface timeslotInfo {
  start_time: number;
  price_type: PriceType;
  price: number;
  isBooked: boolean;
}

export interface BookingQuery {
  date: string;
  studio: string;
}

interface Props {
  searchParams: Promise<BookingQuery>;
}

const bookingSelectDateTimePage = async (props: Props) => {
  const searchParams = await props.searchParams;

  const studioSlug = searchParams.studio;

  if (!studioSlug) {
    redirect("/studio");
  }

  const isStudioExist = await bookingService.isStudioExist(studioSlug);

  if (!isStudioExist.success) {
    redirect("/studio");
  }

  return (
    <div className="md:flex gap-5">
      <div className="lg:w-1/3  w-full">
        <Calendar />
      </div>
      <div className="lg:w-2/3  w-full">
        <Flex direction="column" gap="9">
          <GenerateTimeslot searchParams={searchParams} />
          <BookingInfo searchParams={searchParams} />
        </Flex>
      </div>
    </div>
  );
};

export default bookingSelectDateTimePage;
