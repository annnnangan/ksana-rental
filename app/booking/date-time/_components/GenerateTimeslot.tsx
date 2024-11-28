import {
  convertStringToTime,
  formatDate,
  getHourFromTime,
} from "@/lib/date-time-utils";
import { bookingService } from "@/services/BookingService";
import { compareAsc, format, getDay, parse } from "date-fns";
import "react-day-picker/style.css";
import { BookingQuery, timeslotInfo } from "../page";
import TimeslotList from "./TimeslotList";
import TimeslotType from "./TimeslotType";

interface Props {
  searchParams: BookingQuery;
}

const GenerateTimeslot = async ({ searchParams }: Props) => {
  const studioSlug = searchParams.studio;

  const todayDate = new Date();

  const selectedBookingDate = searchParams.date
    ? searchParams.date
    : formatDate(todayDate);

  //Get studio business hour by day of week
  const businessHourListResult =
    await bookingService.getBusinessHourAndPriceType(
      getDay(selectedBookingDate),
      studioSlug
    );

  //Get time that is blocked by studio
  const timeblockListResult = await bookingService.getStudioTimeblock(
    studioSlug,
    new Date(selectedBookingDate)
  );

  //Get time that is booked
  const bookedTimeListResult = await bookingService.getBookedTimeslot(
    studioSlug,
    new Date(selectedBookingDate)
  );

  //Generate available timeslot based on business hour and then deduct timeblock and booked session
  const generateTimeslotList = () => {
    let availableTimeslots: timeslotInfo[] = [];
    let timeblockList: string[] = [];

    businessHourListResult.forEach((businessHour) => {
      if (businessHour.is_closed === false) {
        const openTime = getHourFromTime(businessHour.open_time, false);
        const endTime = getHourFromTime(businessHour.end_time, true);

        for (let i = openTime; i < endTime; i++) {
          availableTimeslots.push({
            start_time: convertStringToTime(i),
            price_type: businessHour.price_type,
            price: businessHour.price,
            isBooked: false,
          });
        }
      }
    });

    if (timeblockListResult.success && timeblockListResult.data?.length! > 0) {
      timeblockListResult.data?.forEach((time) => {
        const startTime = getHourFromTime(time.start_time, false);
        const endTime = getHourFromTime(time.end_time, true);

        for (let i = startTime; i < endTime; i++) {
          timeblockList.push(convertStringToTime(i));
        }
      });
    }

    //filter out time that is blocked by studio owner
    availableTimeslots = availableTimeslots.filter(
      (item) => !timeblockList.includes(item.start_time)
    );

    //Change the booked timeslot's isBooked status to true
    if (
      bookedTimeListResult.success &&
      bookedTimeListResult.data?.length! > 0
    ) {
      bookedTimeListResult.data!.forEach((bookedTime) => {
        availableTimeslots.forEach((availableTime) => {
          if (bookedTime.start_time === availableTime.start_time) {
            availableTime.isBooked = true;
          }
        });
      });
    }
    //sort the timeslot by order
    availableTimeslots = availableTimeslots.sort(
      (prev, cur) =>
        getHourFromTime(prev.start_time, false) -
        getHourFromTime(cur.start_time, false)
    );

    //Remove timeslot that is in the past
    if (selectedBookingDate === formatDate(todayDate)) {
      availableTimeslots = availableTimeslots.filter(({ start_time }) => {
        const slotTime = parse(start_time, "HH:mm:ss", new Date());

        const currentTime = parse(
          format(todayDate, "HH:mm:ss"),
          "HH:mm:ss",
          new Date()
        );
        return compareAsc(slotTime, currentTime) >= 0;
      });
    }

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
