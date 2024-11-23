import { bookingService } from "@/services/BookingService";
import { PriceType } from "@/services/model";
import { Flex } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import "react-day-picker/style.css";
import BookingInfo from "./_components/BookingInfo";
import Calendar from "./_components/Calendar";
import GenerateTimeslot from "./_components/GenerateTimeslot";
export interface timeslotInfo {
  start_time: string;
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

  // const cookieStore = await cookies();

  //if studio is not exist in the query string, redirect the user to the studio page
  if (!studioSlug) {
    redirect("/studio");
  }

  const isStudioExist = await bookingService.isStudioExist(studioSlug);
  //if studio in the query string doesn't exist in the database, redirect user to the studio page
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
