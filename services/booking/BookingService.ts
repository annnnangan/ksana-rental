import { calculateBookingEndTime, convertStringToTime, isPastDate, isPastDateTime } from "@/lib/utils/date-time/date-time-utils";
import { BookingFormData } from "@/lib/validations/zod-schema/booking-schema";
import { knex } from "@/services/knex";

import handleError from "@/lib/handlers/error";
import { ForbiddenError, NotFoundError, RequestError, UnauthorizedError } from "@/lib/http-errors";
import { reviewFormData } from "@/lib/validations/zod-schema/review-booking-schema";
import { Knex } from "knex";
import { validateStudioService } from "../studio/ValidateStudio";
import { bookingStatusService } from "./BookingStatusService";
import { validateBookingService } from "./ValidateBookingService";

const dayOfWeekList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export class BookingService {
  constructor(private knex: Knex) {}

  //Validate if the booking reference number exists and belongs to the user
  //Validate if the booking status is pending of payment
  async validateBooking(bookingReference: string, userId: number) {
    try {
      //check if this booking reference number belong to the user
      const bookingReferenceResult = (await this.knex.select("status").from("booking").where("reference_no", bookingReference).andWhere("user_id", userId))[0];

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
        throw new RequestError(500, error instanceof Error ? error.message : "An unknown error occurred");
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
      const bookingReferenceResult = (await this.knex.select("status").from("booking").where("reference_no", bookingReference).andWhere("user_id", userId))[0];

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
    const studioId = (await this.knex.select("id").from("studio").where("slug", studioSlug))[0]?.id;

    if (studioId) {
      return { success: true, msg: "Success.", status: 200 };
    } else {
      return { success: false, msg: "Studio doesn't exist.", status: 404 };
    }
  }

  /* ---------------------- Generate Available Timeslots ---------------------- */
  async getBusinessHourAndPriceType(dayOfWeek: number, studioSlug: string) {
    // todo: use slug to match the studio id
    const studioId = (await this.knex.select("id").from("studio").where("slug", studioSlug))[0]?.id;

    // todo: where condition: day of week + studio id
    return this.knex
      .select("studio_business_hour.is_closed", "studio_business_hour.open_time", "studio_business_hour.end_time", "studio_price.price_type", "studio_price.price")
      .from("studio_business_hour")
      .where("day_of_week", dayOfWeekList[dayOfWeek])
      .andWhere("studio_business_hour.studio_id", studioId)
      .leftJoin("studio_price", "studio_business_hour.price_type_id", "studio_price.id");
  }

  async getStudioTimeblock(studioSlug: string, date: Date) {
    const studioId = (await this.knex.select("id").from("studio").where("slug", studioSlug))[0]?.id;

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
      data: await this.knex.select("start_time", "end_time").from("studio_timeblock").where("studio_id", studioId).andWhere("date", new Date(date)),
    };
  }

  async getBookedTimeslot(studioSlug: string, date: Date) {
    //1. Validate if studio exist
    const studioId = (await this.knex.select("id").from("studio").where("slug", studioSlug))[0]?.id;

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
          this.whereIn("status", ["confirm", "complete", "pending for payment"]);
        }),
    };
  }

  async getBookingStatus(bookingReference: string, userId: number) {
    try {
      const bookingStatus = (await this.knex.select("status").from("booking").where("reference_no", bookingReference).andWhere("user_id", userId))[0]?.status;

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
        throw new RequestError(500, error instanceof Error ? error.message : "An unknown error occurred");
      }
    }
  }

  async updateConfirmBooking(bookingReference: string, userId: number, stripePaymentId: string) {
    try {
      const isValidBooking = await this.validateBooking(bookingReference, userId);

      if (isValidBooking.success) {
        await this.knex("booking").update({ status: "confirm", stripe_payment_id: stripePaymentId }).where("reference_no", bookingReference).andWhere("user_id", userId);
      }

      return {
        success: true,
        message: "The booking status has been updated",
        data: [],
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getConfirmBookingInfo(bookingReference: string, userId: number) {
    try {
      //todo - validate if the booking reference number belongs to user
      const isValidBooking = await this.validateIsBookingExist(bookingReference, userId);

      if (isValidBooking.success) {
        //todo - check booking status
        const bookingStatus = await this.getBookingStatus(bookingReference, userId);

        //todo - No information will be pulled when the status is not confirm
        if (bookingStatus.data !== "confirm") {
          throw new Error("此預約未付款/已過期。");
        }

        if (bookingStatus.data === "confirm") {
          const bookingData = (
            await this.knex
              .select("studio.slug", "studio.name", "studio.address", "booking.date", "booking.start_time", "booking.end_time")
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
        throw new RequestError(500, error instanceof Error ? error.message : "系統發生錯誤。");
      }
    }
  }

  async submitBookingReview(bookingReference: string, userId: string, data: reviewFormData) {
    const txn = await this.knex.transaction(); // Start transaction
    try {
      const booking = await this.knex("booking").where({ reference_no: bookingReference, user_id: userId }).first();

      // If no booking found, throw an error
      if (!booking) {
        throw new NotFoundError("預約");
      }

      // Transaction 1: Insert a new row for review and return the review id
      const reviewId = (
        await txn
          .insert({
            booking_reference_no: bookingReference,
            rating: data.rating,
            review: data.review,
            is_anonymous: data.is_anonymous,
            is_hide_from_public: data.is_hide_from_public,
            is_complaint: data.is_complaint,
          })
          .into("review")
          .returning("id")
      )[0].id;

      // Transaction 2: Update booking table 's has_reviewed column to true
      await txn("booking").update({ has_reviewed: true }).where("reference_no", bookingReference);

      // Transaction 3: if there is image -> insert new row with the review id returned above
      if (data.images.length > 0) {
        const reviewPhotos = data.images.map((image) => ({
          review_id: reviewId,
          photo: image,
        }));

        await txn.insert(reviewPhotos).into("review_photo");
      }

      // Transaction 3: if it is complaint, insert new row in booking_complaint
      if (data.is_complaint) {
        await txn
          .insert({
            review_id: reviewId,
            status: "open",
          })
          .into("booking_complaint");
      }

      // Transaction 4: if complaint, change the booking table to true
      if (data.is_complaint) {
        await txn("booking").update("is_complaint", true).where("reference_no", bookingReference);
      }

      await txn.commit();
      return { success: true };
    } catch (error) {
      console.log(error);
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getBookingInfoByReferenceNo(bookingReferenceNo: string) {
    try {
      // Find the booking first to make sure it exists
      const booking = await this.knex("booking").where({ reference_no: bookingReferenceNo }).first(); // Get the first matching record

      // If no booking found, throw an error
      if (!booking) {
        throw new NotFoundError("預約");
      }

      // Determine the latest status
      let latestStatus = booking.status;

      if (booking.status === "confirmed") {
        const isCompleted = await this.knex("booking").where("reference_no", bookingReferenceNo).andWhereRaw("date::DATE + end_time::INTERVAL < NOW()").first();

        if (isCompleted) {
          latestStatus = "completed";
        }
      } else if (booking.status === "pending for payment") {
        const isExpired = await this.knex("booking").where("reference_no", bookingReferenceNo).andWhereRaw("created_at < NOW() - INTERVAL '15 minutes'").first();

        if (isExpired) {
          latestStatus = "expired";
        }
      }

      return {
        success: true,
        data: { ...booking, status: latestStatus },
      };
    } catch (error) {
      // Handle the error and provide a meaningful message
      console.error(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  //Get Studio Door Password
  async getDoorPasswordForBooking(studioId: string) {
    try {
      //check if studio exist
      const isStudioExist = await validateStudioService.validateIsStudioExistById(studioId);

      if (!isStudioExist.success) {
        return isStudioExist;
      }

      if (isStudioExist.success && isStudioExist.data.id) {
        const result = await this.knex.select("door_password").from("studio").where("id", studioId).first();

        if (!result.door_password) {
          return {
            success: false,
            error: { message: "無法取得大門密碼，請聯絡場地以取得密碼。" },
            errorStatus: 404,
          };
        }

        return {
          success: true,
          data: result,
        };
      }
    } catch (error) {
      console.error("Error fetching door password:", error);

      return {
        success: false,
        error: { message: "無法取得大門密碼，請聯絡場地以取得密碼。" },
        errorStatus: 500,
      };
    }
  }

  /* -------------------------------------------------- 💳 Create Booking ------------------------------------------------------------ */
  // 1. Create pending for payment booking before going to payment page to on hold timeslots to avoid double booking
  async createPendingForPaymentBooking(bookingInfo: BookingFormData, userId: string) {
    try {
      /* ---------------------- Validate if the studio exist ---------------------- */
      const validationStudioResponse = await validateStudioService.validateIsStudioExistBySlug(bookingInfo.studioSlug);

      if (!validationStudioResponse.success) {
        return validationStudioResponse;
      }

      const studioId = validationStudioResponse.data?.studio_id;

      /* -------- Validate if the selected date and time is not in the past ------- */
      const isPastBookingDateTime = isPastDateTime(bookingInfo.date, bookingInfo.startTime);

      if (isPastBookingDateTime) {
        throw new ForbiddenError("你所選擇之預約日期時間已過。");
      }

      //TODO - Validate if the selected date and time is available for booking
      //a. check if it is inside the booking table with status = confirm & pending for payment -> if yes throw error
      // const isBooked = (
      //   await this.knex
      //     .select("id")
      //     .from("booking")
      //     .where("date", bookingInfo.date)
      //     .andWhere("start_time", bookingInfo.startTime)
      //     .andWhere("studio_id", studioId)
      //     .andWhere(function () {
      //       this.whereIn("status", ["confirm", "complete", "pending for payment"]);
      //     })
      // )[0]?.id;

      // if (isBooked) {
      //   throw new Error("你所選擇之日期時間已被預約。");
      // }
      //b. check if it is within the business hour
      // const businessHours = await this.knex
      //   .select("open_time", "end_time", "is_closed")
      //   .from("studio_business_hour")
      //   .where("day_of_week", dayOfWeekList[getDay(bookingInfo.date)])
      //   .andWhere("studio_id", studioId);

      // if (businessHours[0]["is_closed"] || !isTimeInRange(bookingInfo.startTime, businessHours)) {
      //   throw new Error("你所選擇之日期時間不在營業時間內。");
      // }

      //c. check if it is inside the timeblock table -> if yes -> throw error
      // const timeblockList = await this.knex.select("start_time as open_time", "end_time").from("studio_timeblock").where("date", bookingInfo.date).andWhere("studio_id", studioId);

      // if (timeblockList.length > 0 && isTimeInRange(bookingInfo.startTime, timeblockList)) {
      //   throw new Error("你所選擇之日期時間不在營業時間內。");
      // }

      const insertedData = await this.knex
        .insert({
          user_id: userId,
          studio_id: studioId,
          date: new Date(bookingInfo.date),
          start_time: convertStringToTime(bookingInfo.startTime),
          end_time: convertStringToTime(calculateBookingEndTime(bookingInfo.startTime)),
          price: bookingInfo.price,
          actual_payment: bookingInfo.paidAmount,
          credit_redeem_payment: bookingInfo.usedCredit,
          whatsapp: bookingInfo.phone,
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
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  // 2. Get booking information for booking payment step
  async getBookingInfoForPayment(bookingReference: string, userId: string) {
    try {
      // Validate if this booking reference number belong to the user
      const validateIsBookingBelongUserResult = await validateBookingService.validateIsBookingBelongUser(bookingReference, userId);

      // Throw error when the booking reference doesn't exist
      if (!validateIsBookingBelongUserResult.success) {
        return validateIsBookingBelongUserResult;
      }

      // Validate to see if the booking is pending for payment within 15 mins
      const pendingForPaymentBooking = (await this.knex
        .select("status", "created_at")
        .from("booking")
        .where("reference_no", bookingReference)
        .andWhere("status", "pending for payment")
        .andWhereRaw("created_at >= NOW() - INTERVAL '15 minutes'")
        .first())
        ? true
        : false;

      if (!pendingForPaymentBooking) {
        throw new ForbiddenError("此預約已失效/已完成，請重新預約。");
      }

      // Get booking info when the booking reference number belongs to user and is pending for payment
      const actualPayment = (await this.knex.select("actual_payment").from("booking").where("booking.reference_no", bookingReference))[0];

      return {
        success: true,
        data: actualPayment,
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  // 3. Update booking status to confirmed and insert stripe payment id when payment success
  async updateBookingStatusToConfirmed(bookingReference: string, userId: string, stripePaymentId: string) {
    try {
      // Validate if this booking reference number belong to the user
      const validateIsBookingBelongUserResult = await validateBookingService.validateIsBookingBelongUser(bookingReference, userId);

      // Throw error when the booking reference doesn't exist
      if (!validateIsBookingBelongUserResult.success) {
        return validateIsBookingBelongUserResult;
      }

      // Validate to see if the booking is pending for payment within 15 mins
      const pendingForPaymentBooking = (await this.knex
        .select("status", "created_at")
        .from("booking")
        .where("reference_no", bookingReference)
        .andWhere("status", "pending for payment")
        .andWhereRaw("created_at >= NOW() - INTERVAL '15 minutes'")
        .first())
        ? true
        : false;

      if (!pendingForPaymentBooking) {
        throw new ForbiddenError("此預約已失效/已完成，請重新預約。");
      }

      // Update the stripe payment id and booking status to confirmed when payment is success
      await knex("booking").where({ reference_no: bookingReference, user_id: userId }).update({ stripe_payment_id: stripePaymentId, status: "confirmed" });

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  // 4. Return booking information for confirmed booking in booking success page
  async getBookingInfoForBookingSuccessPage(bookingReference: string, userId: string) {
    try {
      // Validate if this booking reference number belong to the user
      const validateIsBookingBelongUserResult = await validateBookingService.validateIsBookingBelongUser(bookingReference, userId);

      // Throw error when the booking reference doesn't exist
      if (!validateIsBookingBelongUserResult.success) {
        return validateIsBookingBelongUserResult;
      }

      console.log("validateIsBookingBelongUserResult", validateIsBookingBelongUserResult);

      // Check if the booking status is confirmed
      const isConfirmedBooking = (await this.knex.select("status").from("booking").where("reference_no", bookingReference).andWhere("status", "confirmed").first()) ? true : false;

      if (!isConfirmedBooking) {
        throw new ForbiddenError("此預約未成功，請重新預約。");
      }

      const bookingRecord = await this.knex
        .select("booking.reference_no", "booking.date", "booking.start_time", "booking.end_time", "studio.name as studio_name", "studio.address as studio_address")
        .from("booking")
        .where("booking.reference_no", bookingReference)
        .andWhere("booking.status", "confirmed")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .first();

      return {
        success: true,
        data: bookingRecord,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* -------------------------------------------------- 📚 Get Booking List ------------------------------------------------------------ */
  /**
   * Return Booking List Based on Role and Status
   * If userId exist, then it will return relevant booking information to particular user
   * If studioId exist, then it will return relevant booking information to particular studio
   */
  async getBookingListByRoleAndStatus({ userId, studioId, bookingType }: { userId?: string; studioId?: string; bookingType: string }) {
    try {
      let query = this.knex.select().from("booking");

      if (userId) {
        query = query
          .select(
            "studio.id as studio_id",
            "studio.logo as studio_logo",
            "studio.slug as studio_slug",
            "studio.name as studio_name",
            "studio.address as studio_address",
            "studio.phone as studio_contact",
            "booking.reference_no as booking_reference_no",
            "booking.price",
            "booking.actual_payment",
            "booking.credit_redeem_payment",
            "booking.date as booking_date",
            "booking.start_time",
            "booking.end_time",
            "booking.remarks",
            "booking.has_reviewed"
          )
          .leftJoin("studio", "booking.studio_id", "studio.id")
          .where({ "booking.user_id": userId });
      } else if (studioId) {
        query = query
          .select(
            "booking.studio_id",
            "booking.reference_no as booking_reference_no",
            "booking.price",
            "booking.date as booking_date",
            "booking.start_time",
            "booking.end_time",
            "booking.remarks",
            "booking.status",
            "users.name as user_name",
            "booking.whatsapp as user_phone"
          )
          .leftJoin("users", "booking.user_id", "users.id")
          .where({ "booking.studio_id": studioId });
      }

      // Apply booking type filter using a reusable function
      query = bookingStatusService.applyBookingStatusFilter(query, bookingType);
      // Order by booking date
      query = query.orderBy("booking.date", "desc");

      const bookingRecords = await query;

      const bookingsRecordsWithStatus = bookingRecords.map((booking) => ({
        ...booking,
        status: bookingType,
      }));

      return {
        success: true,
        data: bookingsRecordsWithStatus,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ------------------------------------- Handle Booking Cancellation by User / Studio ------------------------------------ */
  async cancelBookingAndRefundCredit({ userId, studioId, bookingReferenceNo, role }: { userId?: string; studioId?: string; bookingReferenceNo: string; role: "user" | "studio" }) {
    const txn = await this.knex.transaction(); // Start transaction
    try {
      let booking;

      if (role === "user" && userId) {
        booking = await this.knex("booking").where({ reference_no: bookingReferenceNo, user_id: userId }).first();
      }

      if (role === "studio" && studioId) {
        booking = await this.knex("booking").where({ reference_no: bookingReferenceNo, studio_id: studioId }).first();
      }

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
      const existingCreditAmount = (await this.knex.select("credit_amount").from("users").where({ id: booking.user_id }))[0]?.credit_amount;

      // Transaction 1: Update the booking status
      await txn("booking").where({ reference_no: bookingReferenceNo }).update({ status: "canceled" });

      // Transaction 2: Update user's total credit
      const updatedCredit = parseInt(existingCreditAmount) + refundCreditAmount;

      await txn("users").where({ id: booking.user_id }).update({ credit_amount: updatedCredit });

      // Transaction 3: Log credit change
      await txn("credit_audit_log").insert({
        user_id: booking.user_id,
        description: `${role === "user" ? "用戶" : "場地"}取消預約，退回積分`,
        booking_reference_no: bookingReferenceNo,
        action: "add",
        credit_amount: refundCreditAmount,
      });

      // Step 7: Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const bookingService = new BookingService(knex);
