import { bookingService } from "@/services/BookingService";
import { compareAsc, format, getDay } from "date-fns";
import { redirect } from "next/navigation";
import "react-day-picker/style.css";
import { BookingQuery, timeslotInfo } from "../page";
import TimeslotList from "./TimeslotList";
import TimeslotType from "./TimeslotType";

interface Props {
  searchParams: BookingQuery;
}

const GenerateTimeslot = async ({ searchParams }: Props) => {
  const studioSlug = searchParams.studio;

  const endMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 3
  );

  const selectedBookingDate = searchParams.date
    ? searchParams.date
    : format(new Date(), "yyyy-MM-dd");

  //Get studio business hour by day of week
  const businessHour = await bookingService.getBusinessHourAndPriceType(
    getDay(selectedBookingDate),
    studioSlug
  );

  //Get studio timeblock
  const timeblock = await bookingService.getStudioTimeblock(
    studioSlug,
    new Date(selectedBookingDate)
  );

  //Get time that is booked
  const bookedTimeslots = await bookingService.getBookedTimeslot(
    studioSlug,
    new Date(selectedBookingDate)
  );

  //Generate available timeslot based on business hour and then deduct timeblock and booked session
  const generateTimeslotList = () => {
    let availableTimeslots: timeslotInfo[] = [];
    let timeblockList: number[] = [];

    businessHour.forEach((result) => {
      if (result.is_closed === false) {
        const openTime = result.open_time.split(":").map(Number); // [0, 0, 0]
        let endTime = result.end_time.split(":").map(Number); // [17, 0, 0]

        if (endTime[0] === 23 && endTime[1] === 59) {
          endTime = [24, 0, 0];
        }

        for (let i = openTime[0]; i < endTime[0]; i++) {
          availableTimeslots.push({
            start_time: i,
            price_type: result.price_type,
            price: result.price,
            isBooked: false,
          });
        }
      }
    });

    if (timeblock.success) {
      if (timeblock.data?.length! > 0) {
        timeblock.data?.forEach((time) => {
          const startTime = time.start_time.split(":").map(Number); // [0, 0, 0]
          let endTime = time.end_time.split(":").map(Number); // [17, 0, 0]

          if (endTime[0] === 23 && endTime[1] === 59) {
            endTime = [24, 0, 0];
          }

          for (let i = startTime[0]; i < endTime[0]; i++) {
            timeblockList.push(i);
          }
        });
      }
    }

    //filter out time that is blocked by studio owner
    availableTimeslots = availableTimeslots.filter(
      (item) => !timeblockList.includes(item.start_time)
    );

    //Change the booked timeslot's isBooked status to true
    if (bookedTimeslots.success) {
      bookedTimeslots.data!.forEach((bookedTime) => {
        availableTimeslots.forEach((availableTime) => {
          if (
            bookedTime.start_time.split(":").map(Number)[0] ===
            availableTime.start_time
          ) {
            availableTime.isBooked = true;
          }
        });
      });
    }
    //sort the timeslot by order
    availableTimeslots = availableTimeslots.sort(
      (prev, cur) => prev.start_time - cur.start_time
    );

    return availableTimeslots;
  };

  const availableTimeslots = generateTimeslotList();

  return (
    <div className="flex flex-col gap-4">
      <TimeslotType />
      <TimeslotList
        availableTimeslots={availableTimeslots}
        searchParams={searchParams}
      />
    </div>
  );
};

export default GenerateTimeslot;
