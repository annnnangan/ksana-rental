import { bookingDateTime } from "@/lib/validations";
import { knex } from "@/services/knex";
import { convertStringToTime } from "@/lib/utils";

import { compareAsc } from "date-fns";
import { Knex } from "knex";

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

  async createBooking(bookingInfo: bookingDateTime, userId: number) {
    const studioId = (
      await this.knex
        .select("id")
        .from("studio")
        .where("slug", bookingInfo.studio)
    )[0]?.id;

    return {
      success: true,
      data: (
        await this.knex
          .insert({
            user_id: userId,
            studio_id: studioId,
            date: new Date(bookingInfo.date),
            start_time: convertStringToTime(bookingInfo.startTime),
            end_time: convertStringToTime(
              parseInt(bookingInfo.startTime.split(":")[0]) + 1 + ":00"
            ),
            price: bookingInfo.price,
            whatsapp: bookingInfo.whatsapp,
            remarks: bookingInfo.remarks,
            status: "pending for payment",
            is_complained: false,
          })
          .into("booking")
          .returning("reference_no")
      )[0],
    };
  }
}

export const bookingService = new BookingService(knex);
