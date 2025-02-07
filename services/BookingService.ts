import { Tbooking, TbookingPhoneRemarks } from "@/lib/validations";
import { knex } from "@/services/knex";
import {
  calculateBookingEndTime,
  convertStringToTime,
  isPastDate,
  isPastDateTime,
  isTimeInRange,
} from "@/lib/utils/date-time/date-time-utils";

import { compareAsc, getDate, getDay } from "date-fns";
import { Knex } from "knex";
import {
  ForbiddenError,
  NotFoundError,
  RequestError,
  UnauthorizedError,
} from "@/lib/http-errors";
import handleError from "@/lib/handlers/error";
import { BookingStatus } from "./model";

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

  //Validate if the booking reference number exists and belongs to the user
  //Validate if the booking status is pending of payment
  async validateBooking(bookingReference: string, userId: number) {
    try {
      //check if this booking reference number belong to the user
      const bookingReferenceResult = (
        await this.knex
          .select("status")
          .from("booking")
          .where("reference_no", bookingReference)
          .andWhere("user_id", userId)
      )[0];

      //Throw error when the booking reference doesn't exist for the user
      if (bookingReferenceResult === undefined) {
        throw new NotFoundError("此預約");
      }

      //Throw error when the booking reference status is not pending for payment
      if (bookingReferenceResult.status !== "pending for payment") {
        //Throw error when the booking has been completed/canceled/expired
        throw new ForbiddenError("你的預約已過期/已完成，請重新預約。");
      }
      return {
        success: true,
        message: "The booking reference number exists and belongs to the user",
        data: [],
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

  async validateIsBookingExist(bookingReference: string, userId: number) {
    try {
      if (!bookingReference) {
        throw new NotFoundError("此預約");
      }

      if (!userId) {
        throw new UnauthorizedError("請先登入。");
      }
      //check if this booking reference number belong to the user
      const bookingReferenceResult = (
        await this.knex
          .select("status")
          .from("booking")
          .where("reference_no", bookingReference)
          .andWhere("user_id", userId)
      )[0];

      //Throw error when the booking reference doesn't exist for the user
      if (bookingReferenceResult === undefined) {
        throw new NotFoundError("此預約");
      }

      return {
        success: true,
        message: "The booking reference number exists and belongs to the user",
        data: [],
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(500, "系統發生錯誤。");
      }
    }
  }

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
    if (isPastDate(date)) {
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
    //1. Validate if studio exist
    const studioId = (
      await this.knex.select("id").from("studio").where("slug", studioSlug)
    )[0]?.id;

    if (!studioId) {
      return { success: false, msg: "Studio doesn't exist.", status: 404 };
    }

    //2. Validate if the selected date and time is not in the past

    if (isPastDate(date)) {
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
            "complete",
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
              "complete",
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
          is_complaint: false,
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

  async getBookingStatus(bookingReference: string, userId: number) {
    try {
      const bookingStatus = (
        await this.knex
          .select("status")
          .from("booking")
          .where("reference_no", bookingReference)
          .andWhere("user_id", userId)
      )[0]?.status;

      if (!bookingStatus) {
        throw new NotFoundError("此預約");
      }

      return {
        success: true,
        data: bookingStatus,
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

  async updateIsAcceptTnCValue(bookingReference: string, userId: number) {
    try {
      //check if this booking reference number belong to the user
      const bookingReferenceResult = (
        await this.knex
          .select("status", "is_accept_tnc")
          .from("booking")
          .where("reference_no", bookingReference)
          .andWhere("user_id", userId)
      )[0];

      //Throw error when no result return
      if (bookingReferenceResult === undefined) {
        throw new NotFoundError("此預約");
      }

      //check the booking reference status
      if (bookingReferenceResult.status !== "pending for payment") {
        throw new ForbiddenError("你的預約已過期/已完成，請重新預約。");
      }

      //If the reference number belongs to the user and the status is pending for payment
      //Update the is_accept_tnc value from false to true
      if (bookingReferenceResult.is_accept_tnc === false) {
        await this.knex("booking")
          .update("is_accept_tnc", true)
          .where("reference_no", bookingReference)
          .andWhere("user_id", userId);
      }

      return {
        success: true,
        message: "Successfully update the is_accept_tnc to true",
        data: [],
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

  async getBookingInfo(bookingReference: string, userId: number) {
    try {
      //check if this booking reference number belong to the user
      const bookingReferenceResult = (
        await this.knex
          .select("status", "is_accept_tnc")
          .from("booking")
          .where("reference_no", bookingReference)
          .andWhere("user_id", userId)
      )[0];

      //Throw error when the booking reference doesn't exist
      if (bookingReferenceResult === undefined) {
        throw new NotFoundError("此預約");
      }

      //Throw error when the booking has been completed/canceled/expired
      if (bookingReferenceResult.status !== "pending for payment") {
        throw new ForbiddenError("你的預約已過期/已完成，請重新預約。");
      }

      //Get studio info when the booking reference number belongs to user and is pending for payment
      const studioData = (
        await this.knex
          .select(
            "studio.name",
            "studio.address",
            "booking.date",
            "booking.start_time",
            "booking.end_time",
            "booking.price",
            "booking.whatsapp",
            "booking.remarks"
          )
          .from("booking")
          .leftJoin("studio", "booking.studio_id", "studio.id")
          .where("booking.reference_no", bookingReference)
          .andWhere("booking.user_id", userId)
      )[0];
      return {
        success: true,
        data: studioData,
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

  async updatePhoneRemarks(
    bookingReference: string,
    userId: number,
    bookingInfo: TbookingPhoneRemarks
  ) {
    try {
      //check if this booking reference number belong to the user
      const bookingReferenceResult = (
        await this.knex
          .select("status", "is_accept_tnc")
          .from("booking")
          .where("reference_no", bookingReference)
          .andWhere("user_id", userId)
      )[0];

      //Throw error when the booking reference doesn't exist
      if (bookingReferenceResult === undefined) {
        throw new NotFoundError("此預約");
      }

      if (bookingReferenceResult["is_accept_tnc"] === false) {
        throw new ForbiddenError("你還沒同意條款與細則。");
      }

      if (bookingReferenceResult.status !== "pending for payment") {
        //Throw error when the booking has been completed/canceled/expired
        throw new ForbiddenError("你的預約已過期/已完成，請重新預約。");
      }

      await this.knex("booking")
        .update({
          whatsapp: bookingInfo.whatsapp,
          remarks: bookingInfo.remarks,
        })
        .where("reference_no", bookingReference)
        .andWhere("user_id", userId);

      return {
        success: true,
        message: "Whatsapp and remarks are updated successfully.",
        data: [],
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

  async updateConfirmBooking(
    bookingReference: string,
    userId: number,
    stripePaymentId: string
  ) {
    try {
      const isValidBooking = await this.validateBooking(
        bookingReference,
        userId
      );

      if (isValidBooking.success) {
        await this.knex("booking")
          .update({ status: "confirm", stripe_payment_id: stripePaymentId })
          .where("reference_no", bookingReference)
          .andWhere("user_id", userId);
      }

      return {
        success: true,
        message: "The booking status has been updated",
        data: [],
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

  async getConfirmBookingInfo(bookingReference: string, userId: number) {
    try {
      //todo - validate if the booking reference number belongs to user
      const isValidBooking = await this.validateIsBookingExist(
        bookingReference,
        userId
      );

      if (isValidBooking.success) {
        //todo - check booking status
        const bookingStatus = await this.getBookingStatus(
          bookingReference,
          userId
        );

        //todo - No information will be pulled when the status is not confirm
        if (bookingStatus.data !== "confirm") {
          throw new Error("此預約未付款/已過期。");
        }

        if (bookingStatus.data === "confirm") {
          const bookingData = (
            await this.knex
              .select(
                "studio.slug",
                "studio.name",
                "studio.address",
                "booking.date",
                "booking.start_time",
                "booking.end_time"
              )
              .from("booking")
              .leftJoin("studio", "booking.studio_id", "studio.id")
              .where("booking.reference_no", bookingReference)
              .andWhere("booking.user_id", userId)
          )[0];
          return {
            success: true,
            data: bookingData,
          };
        }
      }
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async cancelBookingAndRefundCredit(
    bookingReferenceNo: string,
    userId: string
  ) {
    const txn = await this.knex.transaction(); // Start transaction
    try {
      const booking = await this.knex("booking")
        .where({ reference_no: bookingReferenceNo, user_id: userId })
        .first(); // Get the first matching record

      // If no booking found, throw an error
      if (!booking) {
        throw new NotFoundError("預約");
      }

      // Check if the booking is already canceled
      if (booking.status === "canceled") {
        throw new ForbiddenError("預約已取消。");
      }

      // Get existing booking price
      const refundCreditAmount = parseInt(booking.price);

      // Get existing user credit
      const existingCreditAmount = (
        await this.knex
          .select("credit_amount")
          .from("users")
          .where({ id: userId })
      )[0]?.credit_amount;

      // Transaction 1: Update the booking status
      await txn("booking")
        .where({ reference_no: bookingReferenceNo, user_id: userId })
        .update({ status: "canceled" });

      // Transaction 2: Update user's total credit
      const updatedCredit = parseInt(existingCreditAmount) + refundCreditAmount;

      await txn("users")
        .where({ id: userId })
        .update({ credit_amount: updatedCredit });

      // Transaction 3: Log credit change
      await txn("credit_audit_log").insert({
        user_id: userId,
        description: "預約取消，退回積分",
        booking_reference_no: bookingReferenceNo,
        action: "add",
        credit_amount: updatedCredit,
      });

      // Step 7: Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getBookingInfoByReferenceNo(bookingReferenceNo: string) {
    try {
      // Find the booking first to make sure it exists
      const booking = await this.knex("booking")
        .where({ reference_no: bookingReferenceNo })
        .first(); // Get the first matching record

      // If no booking found, throw an error
      if (!booking) {
        throw new NotFoundError("預約");
      }

      return {
        success: true,
        data: booking,
      };
    } catch (error) {
      // Handle the error and provide a meaningful message
      console.error(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const bookingService = new BookingService(knex);
