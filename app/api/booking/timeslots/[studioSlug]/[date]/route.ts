import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import {
  convertIntegerToStringTime,
  getHourFromTime,
} from "@/lib/utils/date-time/format-time-utils";
import { isPastDate, isPastDateTime } from "@/lib/utils/date-time/formate-date-time";
import { bookingService } from "@/services/booking/BookingService";

import { NextRequest, NextResponse } from "next/server";

// GET Booking Timeslots for a Studio
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ studioSlug: string; date: string }> }
) {
  try {
    const studioSlug = (await props.params).studioSlug;
    const date = (await props.params).date;

    const user = await sessionUser();
    if (!user) {
      throw new ForbiddenError("請先登入才可預約。");
    }

    // check if date is in the past
    const isSelectedPastDate = isPastDate(date);
    if (isSelectedPastDate) {
      throw new ForbiddenError("不能選擇過去的日期。");
    }

    const [openingHourResponse, bookedTimeslotsResponse] = await Promise.all([
      bookingService.getStudioOpeningHourByDate(date, studioSlug),
      bookingService.getStudioBookedTimeslotByDate(date, studioSlug),
    ]);

    if (!openingHourResponse.success || !bookedTimeslotsResponse.success) {
      return handleError(openingHourResponse || bookedTimeslotsResponse, "api") as APIErrorResponse;
    }

    let loopedOpeningHours;

    if (openingHourResponse.success && bookedTimeslotsResponse.success) {
      //@ts-expect-error expected
      if (openingHourResponse?.data[0]?.is_closed === true) {
        return NextResponse.json({ success: true, data: [] }, { status: 201 });
      }

      //@ts-expect-error expected
      loopedOpeningHours = openingHourResponse?.data.reduce((acc, current) => {
        const fromTimeInteger = getHourFromTime(current.from, false);
        const toTimeInteger = getHourFromTime(current.to, true);

        const timeslotsArray = [];

        for (let i = fromTimeInteger; i < toTimeInteger; i++) {
          // If the date is today, exclude times that are in the past
          const isPastSelectedDateTime = isPastDateTime(
            new Date(date),
            convertIntegerToStringTime(i)
          );

          if (!isPastSelectedDateTime) {
            timeslotsArray.push({
              time: convertIntegerToStringTime(i),
              //@ts-expect-error expected
              is_booked: bookedTimeslotsResponse?.data?.includes(i),
              price: current.price,
              price_type: current.price_type,
            });
          }
        }

        return acc.concat(timeslotsArray);
      }, []);
    }

    return NextResponse.json({ success: true, data: loopedOpeningHours }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
