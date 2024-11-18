import { Tbooking } from "@/lib/validations";
import { knex } from "@/services/knex";
import {
  calculateBookingEndTime,
  convertStringToTime,
  isPastDateTime,
  isTimeInRange,
} from "@/lib/utils";

import { compareAsc, getDate, getDay } from "date-fns";
import { Knex } from "knex";
import { NotFoundError, RequestError } from "@/lib/http-errors";
import handleError from "@/lib/handlers/error";

const dayOfWeekList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export class BookingService {
  constructor(private knex: Knex) {}

  async isStudioExist(studioSlug: string) {
    const studioId = (
      await this.knex.select("id").from("studio").where("slug", studioSlug)
    )[0]?.id;

    if (studioId) {
      return { success: true, msg: "Success.", status: 200 };
    } else {
      return { success: false, msg: "Studio doesn't exist.", status: 404 };
    }
  }

  async getStudioNameAddress(studioSlug: string) {
    const studioId = (
      await this.knex.select("id").from("studio").where("slug", studioSlug)
    )[0]?.id;

    if (!studioId)
      return { success: false, msg: "Studio doesn't exist.", status: 404 };

    return {
      success: true,
      data: await this.knex
        .select("name", "address")
        .from("studio")
        .where("slug", studioSlug),
    };
  }

  async getBusinessHourAndPriceType(dayOfWeek: number, studioSlug: string) {
    // todo: use slug to match the studio id
    const studioId = (
      await this.knex.select("id").from("studio").where("slug", studioSlug)
    )[0]?.id;

    // todo: where condition: day of week + studio id
    return this.knex
      .select(
        "studio_business_hour.is_closed",
        "studio_business_hour.open_time",
        "studio_business_hour.end_time",
        "studio_price.price_type",
        "studio_price.price"
      )
      .from("studio_business_hour")
      .where("day_of_week", dayOfWeekList[dayOfWeek])
      .andWhere("studio_business_hour.studio_id", studioId)
      .leftJoin(
        "studio_price",
        "studio_business_hour.price_type_id",
        "studio_price.id"
      );
  }

  async getStudioTimeblock(studioSlug: string, date: Date) {
    const studioId = (
      await this.knex.select("id").from("studio").where("slug", studioSlug)
    )[0]?.id;

    //Return error when studio don't exist
    if (!studioId) {
      return { success: false, msg: "Studio doesn't exist.", status: 404 };
    }

    //if the date we get is not in the past, we don't return any result
    //in the past = -1
    if (compareAsc(new Date(date), new Date()) < 0) {
      return {
        success: false,
        msg: "The date you pass is in the past.",
        status: 400,
      };
    }

    return {
      success: true,
      data: await this.knex
        .select("start_time", "end_time")
        .from("studio_timeblock")
        .where("studio_id", studioId)
        .andWhere("date", new Date(date)),
    };
  }

  async getBookedTimeslot(studioSlug: string, date: Date) {
    const studioId = (
      await this.knex.select("id").from("studio").where("slug", studioSlug)
    )[0]?.id;

    //Return error when studio don't exist
    if (!studioId) {
      return { success: false, msg: "Studio doesn't exist.", status: 404 };
    }

    //if the date we get is not in the past, we don't return any result
    //in the past = -1
    if (compareAsc(new Date(date), new Date()) < 0) {
      return {
        success: false,
        msg: "The date you pass is in the past.",
        status: 400,
      };
    }

    return {
      success: true,
      data: await this.knex
        .select("start_time", "end_time")
        .from("booking")
        .where("studio_id", studioId)
        .andWhere("date", new Date(date))
        .andWhere(function () {
          this.whereIn("status", [
            "confirm",
            "completed",
            "pending for payment",
          ]);
        }),
    };
  }

  async createBooking(bookingInfo: Tbooking, userId: number) {
    try {
      //1. Validate if the studio exist
      const studioId = (
        await this.knex
          .select("id")
          .from("studio")
          .where("slug", bookingInfo.studio)
      )[0]?.id;

      if (!studioId) {
        throw new NotFoundError("此場地");
      }

      //2. Validate if the selected date and time is not in the past
      const isPastBookingDateTime = isPastDateTime(
        bookingInfo.date,
        bookingInfo.startTime
      );

      if (isPastBookingDateTime) {
        throw new Error("你所選擇之日期時間已過。");
      }

      //3. Validate if the selected date and time is available for booking
      //3a. check if it is inside the booking table with status = confirm & pending for payment -> if yes throw error
      const isBooked = (
        await this.knex
          .select("id")
          .from("booking")
          .where("date", bookingInfo.date)
          .andWhere("start_time", bookingInfo.startTime)
          .andWhere("studio_id", studioId)
          .andWhere(function () {
            this.whereIn("status", [
              "confirm",
              "completed",
              "pending for payment",
            ]);
          })
      )[0]?.id;

      if (isBooked) {
        throw new Error("你所選擇之日期時間已被預約。");
      }
      //3b. check if it is within the business hour
      const businessHours = await this.knex
        .select("open_time", "end_time", "is_closed")
        .from("studio_business_hour")
        .where("day_of_week", dayOfWeekList[getDay(bookingInfo.date)])
        .andWhere("studio_id", studioId);

      if (
        businessHours[0]["is_closed"] ||
        !isTimeInRange(bookingInfo.startTime, businessHours)
      ) {
        throw new Error("你所選擇之日期時間不在營業時間內。");
      }

      //3c. check if it is inside the timeblock table -> if yes -> throw error
      const timeblockList = await this.knex
        .select("start_time as open_time", "end_time")
        .from("studio_timeblock")
        .where("date", bookingInfo.date)
        .andWhere("studio_id", studioId);

      if (
        timeblockList.length > 0 &&
        isTimeInRange(bookingInfo.startTime, timeblockList)
      ) {
        throw new Error("你所選擇之日期時間不在營業時間內。");
      }

      const insertedData = await this.knex
        .insert({
          user_id: userId,
          studio_id: studioId,
          date: new Date(bookingInfo.date),
          start_time: convertStringToTime(bookingInfo.startTime),
          end_time: convertStringToTime(
            calculateBookingEndTime(bookingInfo.startTime)
          ),
          price: bookingInfo.price,
          whatsapp: bookingInfo.whatsapp,
          remarks: bookingInfo.remarks,
          status: "pending for payment",
          is_complained: false,
        })
        .into("booking")
        .returning("reference_no");

      return {
        success: true,
        data: insertedData[0],
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    }
  }
}

export const bookingService = new BookingService(knex);
